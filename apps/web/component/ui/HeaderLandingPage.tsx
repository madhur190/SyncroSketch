import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function HeaderLandingPage(){
    const router = useRouter();
    return <div className="w-full p-4 flex justify-between pt-6">
        <div className="text-3xl font-medium flex items-center">
            <span className="text-[#4f46e5]">
                Syno
            </span>
            <span className="text-black">
                Sketch
            </span>
        </div>
        <div>
            <Button onClick={()=>{router.push("/signin")}} size="sm" type="primary" text="Start Brainstorming"></Button>
        </div>
    </div>
}