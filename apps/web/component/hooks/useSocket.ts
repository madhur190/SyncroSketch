"use client"
import { useEffect, useRef, useState } from "react";
import { WS_BACKEND_ULR } from "../../config";
import { useRouter } from "next/navigation";


export default function useSocket(){
    const [socket,setSocket] = useState<WebSocket>();
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    useEffect(()=>{
        setLoading(true)
        const token = localStorage.getItem("token");
        if(!token){
            router.push("/signin");
            return;
        }
        const ws = new WebSocket(`${WS_BACKEND_ULR}?token=${token}`);
        ws.onopen = ()=>{
            setLoading(false)
            setSocket(ws);
        }
    },[])
    return {socket,loading};
}