"use client"
import axios from "axios";
import { ReactNode, useEffect, useRef, useState } from "react"
import { HTTP_BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import CircleIcon from "../../component/ui/CircleIcon";
import {  LogOut, Plus, Trash2, X } from "lucide-react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import InputBox from "../../component/ui/InputBox";

type Room = {
    slug:string
    id:string
    admin:boolean
}
type User = {
    email:string
    name:string
}

export default function Me(){
    const [rooms,setRooms] = useState<Room[]>([]);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [create,setCreate] = useState(false);
    useEffect(()=>{
        const getInfo = async()=>{
            try{
                const token = localStorage.getItem("token");
                if(!token){
                    router.push("/signup");
                }
                const response = await axios.get(`${HTTP_BACKEND_URL}/user/me`,{
                    headers:{
                        Authorization:token
                    }
                })
                if(!response.data) return;
                setUser({
                    name:response.data.name,
                    email:response.data.email,
                })
                const newRooms: Room[] = [];
                if(response.data.rooms.length > 0){
                    response.data.rooms.map((room:{id:string,slug:string}) =>{
                        newRooms.push({
                            slug : room.slug,
                            id : room.id,
                            admin:false
                        })
                    })
                }
                if(response.data.administeredRooms.length > 0){
                    response.data.administeredRooms.map((room:{id:string,slug:string}) =>{
                        newRooms.push({
                            slug : room.slug,
                            id : room.id,
                            admin:true
                        })
                    })
                }   
                setRooms(newRooms);
            }
            catch(e){
                console.error("Failed to fetch user data:", e);
                router.push("/signup");
            }
        }
        getInfo();
    },[])


    return <div className="bg-slate-100 w-full h-screen flex flex-col items-center">
        {create && <div><CreateRoomCard rooms={rooms} setRooms={setRooms} setCreate={setCreate} /></div>}
        <div className="bg-white w-full p-4 flex justify-between pt-6 shadow">
            <div className="text-3xl font-medium flex items-center">
                <span className="text-[#4f46e5]">
                    Syno
                </span>
                <span className="text-black">
                    Sketch
                </span>
            </div>
            <div className="pr-4 hover:text-[#111827] cursor-pointer" onClick={()=>{
                localStorage.removeItem("token");
                router.push("./signin");
            }}>
                <LogOut />
            </div>
        </div>
        <div className="mt-8">
            <CustomCard>
                <div className="flex items-center py-2">
                    <div>
                        <CircleIcon text={user?.name.toUpperCase()[0]}/>
                    </div>
                    <div className="pl-2">
                        <span className="font-bold text-xl">
                            {user?.name}
                        </span>
                        <br/>
                        <span>
                            {user?.email}
                        </span>
                    </div>
                </div>
            </CustomCard>
            <div className="pt-6">
                <CustomCard>
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-xl">
                            Your Rooms
                        </div>
                        <div>
                            <Button type="primary" onClick={()=>setCreate(true)}  text="New Room" size="md" icon={<Plus size={20}/>}/>
                        </div>
                    </div>
                    <div>
                        {rooms.length>0 &&  rooms.map((room:Room)=>{
                           return <RoomCard rooms={rooms} setRooms={setRooms} key={room.id} room={room}/>
                        })}
                    </div>
                </CustomCard>
            </div>
        </div>
    </div>
}


function RoomCard({room,rooms,setRooms}:{
    room:Room
    rooms:Room[]
    setRooms:(a:Room[])=>void
}){
    const router = useRouter();

    return <div className={`bg-[#f9fafb] hover:bg-[#f3f4f6] flex justify-between p-6 border-0 rounded-xl h-fit mt-3`}>
        <div>
            {room.slug} {room.admin && <span className="text-xs text-[#4338ca] bg-[#e0e7ff] p-1 px-2 rounded-xl">Owner</span>}
        </div>
        <div className="flex">
            <button onClick={()=>{
                router.push(`room/${room.id}`)
            }} className="hover:bg-[#e5e7eb] p-2 rounded-md -mt-2">Open</button>
            {room.admin && <div> <button 
                onClick={()=>{
                    deleteRoom(room.id)
                    setRooms(rooms.filter((r) => r.id !== room.id));
                }}
                className="hover:bg-[#fef2f2] p-2 rounded-md -my-1 "><Trash2 color="#dc2626" size={18}/> 
            </button> </div>}
        </div>
    </div>
}

function CustomCard({children}:{
    children:ReactNode
}){
    return <div className={`bg-[white] flex flex-col p-6 border-0 rounded-xl w-4xl h-fit shadow-xl`}>
        {children}
    </div>
}

function CreateRoomCard({setCreate,rooms,setRooms}:{
    setCreate:(x:boolean)=>void,
    rooms:Room[]
    setRooms:(x:Room[])=>void
}){

    const handleCreate = async(e: React.FormEvent,)=>{
        e.preventDefault();
        if (!nameRef.current) return;
        try{
            const response = await axios.post(`${HTTP_BACKEND_URL}/rooms/create`,{
                slug:nameRef.current.value
            },{
                headers:{
                    Authorization:localStorage.getItem("token")
                }
            })
            const newRoom:Room = {
                slug:nameRef.current.value,
                id:response.data.roomId,
                admin:true
            }
            setRooms([...rooms,newRoom]);
        }
        catch(e){
            console.log(e);
        }
        setCreate(false);
    };
    const nameRef = useRef<HTMLInputElement|null>(null);
    return<div className="fixed inset-0 z-50 bg-transparent backdrop-blur-md flex items-center justify-center">
        <Card hover={false}>
                <div className="pl-50 -mt-4 cursor-pointer" onClick={()=>setCreate(false)}>
                    <X size={16} />
                </div>
                <div className="text-md font-bold">
                    Enter Room's Name
                </div>
            <form onSubmit={handleCreate}>
                <div className="pb-10">
                    <InputBox reference={nameRef} placeholder="Name" type="text"/>
                </div>
                <div className="flex">
                    <Button type="secondary" onClick={()=>setCreate(false)} size="md" text="Cancle"/>
                    <Button submit={true} type="primary" size="md" text="Confirm"/>
                </div>
            </form>
        </Card>
    </div>
}


async function deleteRoom(roomId:string){
    await axios.delete(`${HTTP_BACKEND_URL}/rooms/${roomId}`,{
        headers:{
            Authorization:localStorage.getItem("token")
        }
    });
}