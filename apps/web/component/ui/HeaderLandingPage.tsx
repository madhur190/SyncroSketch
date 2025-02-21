import mainLogo from "../assets/favicon.ico"
import Image from "next/image";
import Button from "./Button";

export default function HeaderLandingPage(){
    return <div className="w-full p-4 flex justify-between pt-6">
        <div className="text-3xl font-medium flex items-center">
            {/* <span className="p-1">
                <Image src={mainLogo} alt="SynoSketch"/>
            </span> */}
            <span className="text-[#4f46e5]">
                Syno
            </span>
            <span className="text-white">
                Sketch
            </span>
        </div>
        <div>
            <Button size="sm" type="primary" text="Start Brainstorming"></Button>
        </div>
    </div>
}