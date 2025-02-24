import { createRoomSchema } from "@repo/common/types";
import { client } from "@repo/db/client";
import { Router } from "express";
import { auth } from "../middlewares/auth";

const RoomsRouter:Router = Router();

RoomsRouter.post("/create",auth,async(req,res)=>{
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            error:parsedData.error, 
            message:"Incorrect inputs"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    const {slug} = parsedData.data;
    try{
        const newRoom = await client.room.create({
            data:{
                slug,
                admin:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
        res.status(201).json({
            roomId:newRoom.id
        })
    }
    catch(error:any){
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
})

RoomsRouter.get("/chats/:roomId",async(req,res)=>{
    const roomId = req.params.roomId;
    const existingChats = await client.chat.findMany({
        where:{
            roomId
        },
        select:{
            message:true
        }
    })
    res.json({
        message:existingChats
    })
})

RoomsRouter.post("/join/:roomId",auth,async(req,res)=>{
    const roomId = req.params.roomId;
    //@ts-ignore
    const userId = req.userId;
    if(!roomId){
        res.status(400).json({
            message:"Invalid Room"
        })
        return;
    }
    try{
        const user = await client.user.findFirst({
            where:{
                id:userId
            },select:{
                administeredRooms:{
                    select:{
                        id:true
                    }
                },
                rooms:{
                    where:{
                        userId,roomId
                    },
                    select:{
                        roomId:true
                    }
                }
            }
        })
        if(!user){
            res.json({
                message:"You need to login first"
            })
            return;
        }
        const joinedAsAdmin = user?.administeredRooms.some(room => room.id === roomId);
        const joinedAsMember = user?.rooms.length > 0;
        if(joinedAsAdmin || joinedAsMember){
            res.status(200).json({
                message:"You already joined the room"
            })
            return;
        }
        await client.roomUser.create({
            data:{
                userId,
                roomId
            }
        })
        res.status(201).json({
            message:"Joined room"
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"cannot join room"
        })
    }
})

enum RoomMode {
    PRIVATE = "PRIVATE",
    VIEW_ONLY = "VIEW_ONLY",
    OPEN = "OPEN"
}

RoomsRouter.post("/change_mode/:roomId/:mode",auth,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const roomId = req.params.roomId;
    const mode = req.params.mode as string;
    const allowedModes = ["PRIVATE", "VIEW_ONLY", "OPEN"];
    if(!Object.values(RoomMode).includes(mode as RoomMode)){
        res.status(400).json({
            message:"Invalid mode"
        })
        return;
    }
    const requiredRoom = await client.room.findFirst({
        where:{
            id:roomId,
            adminId:userId
        }
    }) 
    
    if(!requiredRoom || !mode){
        res.status(403).json({
            message:"You do not have permission to change this"
        })
        return
    }
    await client.room.update({
        where:{
            id:roomId
        },
        data:{
            mode:mode as RoomMode
        }
    })
    res.status(200).json({
        message:"room mode updated successfully"
    })
})

RoomsRouter.delete("/:roomId",auth,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const roomId = req.params.roomId;
    const room = await client.room.findFirst({
        where: { id: roomId, adminId: userId }
    });
    
    if (!room) {
        res.status(403).json({
            message: "You do not have permission to delete this room or it does not exist"
        });
        return;
    }
    
    await client.room.delete({
        where: { id: roomId }
    });
    
    res.status(200).json({
        message: "Room deleted successfully"
    });
    
})

export default RoomsRouter;