import { Circle, Eraser, Minus, Pencil, Square, Type } from "lucide-react"
import { ReactNode } from "react"


export type Tools = "circle"|"rect"|"text"|"line"|"pencil"|"eraser"

export default function ToolBar({selectedTool,setSelectedTool}:{
    selectedTool:Tools,
    setSelectedTool:(s:Tools)=>void
}){
    return <div className="absolute left-1/2 -translate-x-1/2 top-5 rounded-xl px-4 bg-[#232329]
                         text-white flex justify-between py-1 w-96">
        <Tool activated={selectedTool === "pencil"} Icon={<Pencil/>} onClick={()=>{
            setSelectedTool("pencil")
        }}></Tool>
        <Tool activated={selectedTool === "rect"} Icon={<Square/>} onClick={()=>{
            setSelectedTool("rect")
        }} ></Tool>
        <Tool activated={selectedTool === "circle"} Icon={<Circle/>} onClick={()=>{
            setSelectedTool("circle")
        }}></Tool>
        <Tool activated={selectedTool === "line"} Icon={<Minus/>} onClick={()=>{
            setSelectedTool("line")
        }}></Tool>
        <Tool activated={selectedTool === "text"} Icon={<Type/>} onClick={()=>{
            setSelectedTool("text")
        }}></Tool >
        <Tool activated={selectedTool === "eraser"} Icon={<Eraser/>} onClick={()=>{
            setSelectedTool("eraser")
        }}></Tool>
    </div>
}

function Tool({Icon,onClick,activated}:{
    activated:boolean
    Icon:ReactNode,
    onClick?:()=>void
}){
    return <div onClick={onClick} className={`p-2 rounded-xl ${activated? "bg-[#403e6a]":"hover:bg-[#31303b]"}`}>
            {Icon}
        </div >
}