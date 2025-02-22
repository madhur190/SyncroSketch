"use client"
import { useEffect, useRef, useState } from "react"
import useSocket from "../hooks/useSocket";
import ToolBar, { Tools } from "./ToolBar";
import { Game } from "../Draw/Game";


export default function Canva({roomId}:{
    roomId:string
}){
    const [selectedTool,setSelectedTool] = useState<Tools>("pencil");
    const [game,setGame] = useState<Game|null>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const {socketRef,loading} = useSocket();
    // useEffect(()=>{
    //     if(socketRef.current && !loading){
    //         socketRef.current.send(JSON.stringify({
    //             type:"join_room",
    //             roomId:roomId
    //         }))
    //     }
    //     return socketRef.current?.send(JSON.stringify({
    //         type:"leave_room",
    //         roomId:roomId
    //     }))
    // },[socketRef.current, loading, roomId])
    // if(loading){
    //     return <div>
    //         connecting to server...
    //     </div>
    // }
    useEffect(()=>{
        game?.setTool(selectedTool);
    },[selectedTool,game])

    useEffect(()=>{
        if(!canvasRef.current) return;
        const g = new Game(canvasRef.current,roomId);
        setGame(g);
        return ()=>{
            g.destroy();
            setGame(null)
        } 
    },[canvasRef])

    return <div>
        <canvas ref={canvasRef} className="relative w-full h-full bg-black"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}