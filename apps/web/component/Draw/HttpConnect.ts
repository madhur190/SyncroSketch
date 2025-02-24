import axios from "axios";
import { HTTP_BACKEND_URL } from "../../config";


export default async function GetExistingShapes(roomid:string){
    const res =await axios.get(`${HTTP_BACKEND_URL}/rooms/chats/${roomid}`);

    const messages = res.data.message;

    const shapes = messages.map((x:{message:string})=>{
        const messageData = JSON.parse(x.message);
        return messageData;
    })

    return shapes;
}