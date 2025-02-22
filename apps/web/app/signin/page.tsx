"use client"

import Link from "next/link";
import Button from "../../component/ui/Button";
import InputBox from "../../component/ui/InputBox";
import { useRef } from "react";
import useAuth from "../../component/hooks/useAuth";



export default function Signin(){
    const emailRef = useRef<HTMLInputElement|null>(null);
    const passwordRef = useRef<HTMLInputElement|null>(null);
    const {Signin,loading,error} = useAuth();
    const handleSignin = async(e: React.FormEvent)=>{
        e.preventDefault();
        if (!emailRef.current || !passwordRef.current) return;
        await Signin(emailRef.current.value, passwordRef.current.value);
    };

    return <div className="bg-slate-100 w-full h-full flex flex-col items-center">
            <div className="bg-white w-full p-4 flex justify-between pt-6 shadow">
                <div className="text-3xl font-medium flex items-center">
                    <span className="text-[#4f46e5]">
                        Syno
                    </span>
                    <span className="text-black">
                        Sketch
                    </span>
                </div>
            </div>
            <div className=" flex flex-col mt-20 items-center">
                <div className="text-4xl font-bold">
                    Good to see you again
                </div>
                <div className="text-lg pt-5 tracking-wider font-light">
                    Start brainstorming with your team in minutes
                </div>
            </div>
            <form onSubmit={handleSignin} >
                <div className="bg-white w-[40rem] p-4 rounded-xl shadow min-h-96 mt-5 flex flex-col items-center justify-evenly">
                    <div className="w-full max-w-[30rem]">
                    <InputBox reference={emailRef} type="text" heading="Email" placeholder="joe@example.com"/>
                    </div>
                    <div className="w-full max-w-[30rem]">
                    <InputBox reference={passwordRef} type="password" heading="Password" placeholder="********"/>
                    </div>
                    {error && <div className="text-red-500">
                        *{error}
                    </div> }
                    <div className="">
                        <Button loading={loading} submit={true} type="primary" size="lg" text="Sign In"/>
                    </div>
                    <div className="flex">
                        <div className="font-light">
                            Don't have an account?
                        </div>
                        <div>
                            <Link className="text-blue-700" href={"/signup"}>Sign up</Link>
                        </div>
                    </div>
                </div>
            </form>
            <div className="mt-10 font-light">
                By signing up, you agree to our Terms of Service and Privacy Policy
            </div>
            <div className="py-20 font-light">
                © 2025 Syncrosketch. All rights reserved.
            </div>
    </div>
}