import { Router } from "express";
import { signinSchema,signupSchema } from "@repo/common/types";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { client } from "@repo/db/client";
import {JWT_SECRET} from "@repo/common/config"
import { auth } from "../middlewares/auth";

const userRouter:Router = Router();

userRouter.post("/signup",async(req,res)=>{
    const parsedData = signupSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            error:parsedData.error.format(),
            message:"Incorrect inputs"
        })
        return;
    }
    const {email,password,name} = parsedData.data;
    const hashedPwd =await bcrypt.hash(password,5);
    let user;
    try{
        user = await client.user.create({
            data:{
                email,
                password:hashedPwd,
                name
            }
        })
    }
    catch(e){
        console.log(e);
        res.status(401).json({
            error:e,
            message:"account cannot be created"
        })
        return;
    }
    const token = jwt.sign({
        userId:user.id
    },JWT_SECRET)
    res.status(201).json({
        message:"Account created",
        token:token
    })
});

userRouter.post("/signin",async (req,res)=>{
    const parsedData = signinSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            error:parsedData.error.format(),
            message:"Incorrect inputs"
        })
        return;
    } 
    const {email,password} = parsedData.data;
    let existingUser;
    try{
        existingUser = await client.user.findFirst({
            where:{
                email
            }
        })
        if(!existingUser){
            res.status(400).json({
                error:"Incorrect credentials"
            })
            return;
        }
        const hashedPwd = existingUser.password;
        const isMatch = await bcrypt.compare(password,hashedPwd);
        if(!isMatch){
            res.status(400).json({
                error:"Incorrect credentials"
            })
            return;
        }
    }
    catch(e){
        console.log(e);
        res.status(401).json({
            error:e,
            message:"Account did not found"
        })
        return;
    }
    const token = jwt.sign({
        userId:existingUser.id
    },JWT_SECRET)
    res.status(201).json({
        token
    })
});

userRouter.get("/me",auth,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId
    const user =  await client.user.findFirst({
        where:{
            id:userId
        },include:{
            administeredRooms:true,
            rooms:{
                include:{
                    room:{
                        include:{admin:true}
                    }
                }
            }
        }
    })
    if(!user){
        res.status(401).json({
            message:"You need to sign in first."
        })
        return;
    }
    res.status(201).json({
        name:user.name,
        email:user.email,
        administeredRooms:user.administeredRooms,
        rooms:user.rooms
    })
})


export default userRouter;