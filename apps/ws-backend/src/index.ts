import {client } from "@repo/db/client"
import { WebSocketServer,WebSocket } from "ws"
import { JWT_SECRET } from "@repo/common/config"
import jwt from "jsonwebtoken"

const wss = new WebSocketServer({port:8080});

type User = {
    socket:WebSocket,
    userId:String,
    rooms:String[]
}

const currentUsers:User[] = [];

const validateUser = (token:string)=>{
    const decoded = jwt.verify(token,JWT_SECRET);
    if(typeof decoded === "string" ||!decoded|| !(decoded).userId){
        return null
    }
    return decoded.userId;
}

wss.on("connection",(socket,request)=>{
    const url =new URLSearchParams(request.url?.split('?')[1])
    const token = url.get("token")||"";

    if(!token) return;
    const userId = validateUser(token);
    if(!userId){
        socket.close();
        return;
    }
    currentUsers.push({
        socket,
        userId,
        rooms:[]
    });
    socket.on("message",async (data)=>{
        const parsedData = JSON.parse(data.toString());
        if(parsedData.type === "join_room"){
            const user = currentUsers.find(x=>x.socket === socket);
            user?.rooms.push(parsedData.roomId);
        }
        else if(parsedData.type === "leave_room"){
            const user = currentUsers.find(x=>x.socket === socket);
            user?.rooms.filter(x=>x !== parsedData.roomId);
        }
        else if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            await client.chat.create({
                data:{
                    message,
                    roomId,
                    userId
                }
            })
            currentUsers.forEach(user=>{
                if(user.rooms.includes(roomId) && user.socket != socket){
                    user.socket.send(data);
                }
            })
        }


    })

    socket.on("close", () => {
        const index = currentUsers.findIndex(u => u.socket === socket);
        if (index !== -1) {
            currentUsers.splice(index, 1);
        }
    });
})



