"use cient"
import axios from "axios";
import { useState } from "react";
import {HTTP_BACKEND_URL} from "../../config"
import { useRouter } from "next/navigation";


export default function useAuth(){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("");
    const router = useRouter();
    const Signin = async (email:string,password:string)=>{
        setLoading(true);
        try {
            const res = await axios.post(`${HTTP_BACKEND_URL}/signin`, { email, password });

            localStorage.setItem("token", res.data.token);
            setLoading(false);
            router.push("/me");
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || "Something went wrong");
        }
    }

    const Signup = async (name:string,email:string,password:string)=>{
        setLoading(true);
        try {
            const res = await axios.post(`${HTTP_BACKEND_URL}/signup`, { name, email, password });

            localStorage.setItem("token", res.data.token);
            setLoading(false);
            router.push("/me");
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || "Something went wrong");
        }
    }
    return {Signin ,Signup ,loading ,error}
}