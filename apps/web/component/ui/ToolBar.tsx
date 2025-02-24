import { Circle, Eraser, Minus, MousePointer, Pencil, Pointer, Square, Type } from "lucide-react"
import { ReactNode } from "react"


export type Tools = "circle"|"rect"|"text"|"line"|"pencil"|"eraser"|"selection"

export default function ToolBar({selectedTool,setSelectedTool}:{
    selectedTool:Tools,
    setSelectedTool:(s:Tools)=>void
}){
    return <div className="absolute left-1/2 -translate-x-1/2 top-5 rounded-xl px-4 bg-[#232329]
                         text-white flex justify-between py-1 w-96">
        <Tool title="Selection" activated={selectedTool === "selection"} Icon={<MousePointer/>} onClick={()=>{
            setSelectedTool("selection")
        }}></Tool>
        <Tool title="Pencil" activated={selectedTool === "pencil"} Icon={<Pencil/>} onClick={()=>{
            setSelectedTool("pencil")
        }}></Tool>
        <Tool title="Rectangle" activated={selectedTool === "rect"} Icon={<Square/>} onClick={()=>{
            setSelectedTool("rect")
        }} ></Tool>
        <Tool title="Circle" activated={selectedTool === "circle"} Icon={<Circle/>} onClick={()=>{
            setSelectedTool("circle")
        }}></Tool>
        <Tool title="Line" activated={selectedTool === "line"} Icon={<Minus/>} onClick={()=>{
            setSelectedTool("line")
        }}></Tool>
        <Tool title="Text" activated={selectedTool === "text"} Icon={<Type/>} onClick={()=>{
            setSelectedTool("text")
        }}></Tool >
        <Tool title="Eraser" activated={selectedTool === "eraser"} Icon={<Eraser/>} onClick={()=>{
            setSelectedTool("eraser")
        }}></Tool>
    </div>
}

function Tool({Icon,onClick,activated,title}:{
    activated:boolean
    Icon:ReactNode,
    onClick?:()=>void,
    title:string
}){
    return <div onClick={onClick} title={title} className={`p-2 rounded-xl ${activated? "bg-[#403e6a]":"hover:bg-[#31303b]"}`}>
            {Icon}
        </div >
}