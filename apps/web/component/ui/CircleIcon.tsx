import { ReactElement } from "react"

type CircleIconProps = {
    icon?:ReactElement
    text?:String
}

export default function CircleIcon({text,icon}:CircleIconProps){
    return <div className="bg-[#e0e7ff] rounded-full w-15 h-15 flex items-center justify-center">
        <div className="flex items-center justify-center text-3xl">
            {text && text}
            {icon &&
             <span>
                {icon}
            </span>}
        </div>
    </div>
}