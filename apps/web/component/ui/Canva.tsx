"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import useSocket from "../hooks/useSocket";
import ToolBar, { Tools } from "./ToolBar";
import { Game, inputField } from "../Draw/Game";

import Button from "./Button";
import { Clipboard, X } from "lucide-react";


export default function Canva({roomId}:{
    roomId:string
}){
    const [copied,setCopied] = useState(false);
    const [share,setShare] = useState(false);
    const [selectedTool,setSelectedTool] = useState<Tools>("selection");
    const [game,setGame] = useState<Game|null>();
    const [inputboxes,setInputBoxes] = useState<inputField[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {socket,loading} = useSocket();
    useEffect(()=>{
        if (!loading && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "join_room", roomId }));
          } else if (socket && socket.readyState === WebSocket.CONNECTING) {
            const onOpen = () => {
              socket?.send(JSON.stringify({ type: "join_room", roomId }));
              socket?.removeEventListener("open", onOpen);
            };
            socket.addEventListener("open", onOpen);
        }
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "leave_room", roomId }));
            }
        };
        
    },[socket,loading, roomId])
    useEffect(()=>{
        game?.setTool(selectedTool);
    },[selectedTool,game])

    useEffect(()=>{
        if(!canvasRef.current||!socket) return;
        const g = new Game(canvasRef.current,roomId,inputboxes,setInputBoxes,socket);
        setGame(g);
        return ()=>{
            g.destroy();
            setGame(null)
        } 
    },[socket,roomId])

    return <div>
        {share &&<div className="fixed inset-0 z-50 bg-transparent backdrop-blur-md flex items-center justify-center">
        <div className="bg-[#232329] rounded-xl shadow pb-14 h-fit p-8 w-xl overflow-hidden">
            <div className="text-white p-2 flex justify-between">
                link
                <div onClick={()=>setShare(false)} className="-mt-4 cursor-pointer">
                    <X size={20}/>
                </div>
            </div>
            <div className="flex">
                <div className="text-white p-2 bg-[#31303b] max-w-[700px] rounded px-2 mx-2 border-black overflow-x-hidden whitespace-nowrap text-left">
                    http://localhost:3000/room/{roomId}
                </div>
                <div onClick={()=>{
                    navigator.clipboard.writeText(`http://localhost:3000/room/${roomId}`)
                    
                }} className="p-2 bg-[#a8a5ff] w-fit rounded-xl cursor-pointer">
                    <Clipboard/>
                </div>
            </div>
        </div>
    </div>}
        <canvas ref={canvasRef} className="relative w-full h-full bg-black"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        {game && inputboxes.map((box,index)=><TextAres  game={game} key={index} box={box} />)}
        <div className="fixed top-5 right-5">
            <Button onClick={()=>setShare(true)} type="primary" size="sm" text="Share" />
        </div>
    </div>
}

function TextAres({box,game}:{
    box:inputField,
    game:Game
}){
    const inputRef = useRef<HTMLInputElement>(null);
    const [value,setValue] = useState(box.text);
    useLayoutEffect(() => {
        if (inputRef) {
            inputRef.current?.focus();
        }
    }, []);
    return <input 
    autoFocus
    ref={inputRef}
    value={value}
    onBlur={(e)=>{
        game.updateText(box,value);
    }}
    onChange={(e)=>{
        setValue(e.target.value)
    }}
    style={{ position: "absolute", top: box.y, left: box.x, background: "transparent",color:"white",border:"black",width:value.length+1+"ch" }} ></input>
}