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
    try{
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
            let parsedData;
            if(typeof data !== "string"){
                parsedData = JSON.parse(JSON.stringify(data));
            }else{
                parsedData = JSON.parse(data);
            }
            if(parsedData.type === "join_room"){
                const user = currentUsers.find(x=>x.socket === socket);
                user?.rooms.push(parsedData.roomId);
            }
            else if(parsedData.type === "leave_room"){
                const user = currentUsers.find(x => x.socket === socket);
                if(user){
                user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
                }
            }
            else if(parsedData.type === "chat"){
                const roomId = parsedData.roomId;
                const message = parsedData.message;

                const stringMessage = JSON.stringify(message);

                await client.chat.create({
                    data:{
                        message:stringMessage,
                        roomId,
                        userId
                    }
                })
                currentUsers.forEach(user=>{
                    if(user.rooms.includes(roomId) && user.socket != socket){
                        user.socket.send(JSON.stringify({
                            type:"chat",
                            message:stringMessage,
                            roomId
                        }));
                    }
                })
            }
            else if(parsedData.type === "delete_chat"){
                await client.chat.deleteMany({
                    where:{
                        roomId:parsedData.roomId,
                        message:JSON.stringify(parsedData.message)
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
    }
    catch(e){
        console.log("Caught error",e);
    }
})



