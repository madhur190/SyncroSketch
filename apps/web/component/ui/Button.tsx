import { ReactElement } from "react"

type varient = "primary" | "secondary";
type size = "sm"|"md"|"lg"

interface ButtonProps{
    type : varient
    size : size
    onClick? : ()=>void
    icon? : ReactElement
    text:string 
    submit?:boolean
    loading?:boolean
}

const varientStyle:Record<varient,string> = {
    "primary":"bg-[#a8a5ff] hover:bg-[#b2aeff]",
    "secondary":"bg-slate-500 text-white hover:bg-[#31303b]"
}

const sizeStyle:Record<size,string> = {
    "sm":"text-sm px-3 py-3",
    "md":"py-4 px-8",
    "lg":"py-4 px-46"
}



export default function Button({type,size,text,onClick,icon,submit=false,loading = false}:ButtonProps){
    return <div>
        <button disabled={loading} onClick={onClick} type={submit ? "submit" : "button"} className={`${varientStyle[type]} ${sizeStyle[size]} m-1 rounded-md flex items-center`}>
            {loading? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>) :<div className="flex items-center">
                {text}</div>} {icon && 
            <span className="inline-flex relative top-0.5 items-center pl-1">
                {icon}
            </span>} 
        </button>
    </div>
}