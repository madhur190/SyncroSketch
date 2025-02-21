import { ReactNode } from "react"

interface cardProps{
    children:ReactNode
    
}


export default function card({children}:cardProps){
    return <div className={`bg-[#2b2d31] flex flex-col items-center justify-between p-8 hover:shadow-2xl border rounded-md w-70 h-70 shadow-md`}>
        {children}
    </div>
}