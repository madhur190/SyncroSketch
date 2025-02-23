"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import useSocket from "../hooks/useSocket";
import ToolBar, { Tools } from "./ToolBar";
import { Game, inputField } from "../Draw/Game";


export default function Canva({roomId}:{
    roomId:string
}){
    const [selectedTool,setSelectedTool] = useState<Tools>("selection");
    const [game,setGame] = useState<Game|null>();
    const [inputboxes,setInputBoxes] = useState<inputField[]>([])
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
        const g = new Game(canvasRef.current,roomId,inputboxes,setInputBoxes);
        setGame(g);
        return ()=>{
            g.destroy();
            setGame(null)
        } 
    },[canvasRef])

    return <div>
        <canvas ref={canvasRef} className="relative w-full h-full bg-black"></canvas>
        <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        {game && inputboxes.map((box,index)=><TextAres  game={game} key={index} box={box} />)}
    </div>
}

function TextAres({box,game}:{
    box:inputField,
    game:Game
}){
    const inputRef = useRef<HTMLInputElement>(null);
    const [value,setValue] = useState(box.text);
    useLayoutEffect(() => {
        if (inputRef.current) {
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