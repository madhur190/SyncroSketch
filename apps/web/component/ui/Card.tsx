import { ReactNode } from "react"

interface cardProps{
    children:ReactNode
    hover?:boolean
    black?:boolean
}


export default function card({children,hover = true,black = false}:cardProps){
    return <div className={`${black?"bg-[#232329]":"bg-[white]"} flex flex-col items-center justify-between p-8 ${hover && "hover:shadow-2xl"} border-0 rounded-md w-70 h-70 shadow-md`}>
        {children}
    </div>
}