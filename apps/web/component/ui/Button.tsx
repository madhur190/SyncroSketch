import { ReactElement } from "react"

type varient = "primary" | "secondary";
type size = "sm"|"md"|"lg"

interface ButtonProps{
    type : varient
    size : size
    onClick? : ()=>void
    icon? : ReactElement
    text:string 
}

const varientStyle:Record<varient,string> = {
    "primary":"bg-[#a8a5ff] hover:bg-[#b2aeff]",
    "secondary":"bg-[#232329] text-white hover:bg-[#31303b]"
}

const sizeStyle:Record<size,string> = {
    "sm":"text-sm px-3 py-3",
    "md":"py-4 px-8",
    "lg":"py-4 px-12"
}



export default function Button({type,size,text,onClick,icon}:ButtonProps){
    return <div>
        <button onClick={onClick} className={`${varientStyle[type]} ${sizeStyle[size]} m-1 rounded-md flex items-center`}>
            {text} {icon && 
            <span className="inline-flex relative top-0.5 items-center pl-1">
                {icon}
            </span>} 
        </button>
    </div>
}