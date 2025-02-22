"use client"
import { useEffect, useRef, useState } from "react";
import { WS_BACKEND_ULR } from "../../config";
import { useRouter } from "next/navigation";


export default function useSocket(){
    const socketRef = useRef<WebSocket>(null);
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    useEffect(()=>{
        setLoading(true)
        const token = localStorage.getItem("token");
        if(!token){
            router.push("/signin");
            return;
        }
        socketRef.current = new WebSocket(`${WS_BACKEND_ULR}?token=${token}`);
        socketRef.current.onopen = ()=>{
            setLoading(false)
        }
    },[])
    return {socketRef,loading};
}