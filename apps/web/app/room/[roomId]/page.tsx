"use-client"

import Canva from "../../../component/ui/Canva";

interface RoomProps {
    params: {
      roomId: string;
    };
}

export default async function Room({params}:RoomProps){
    const roomId = (await params).roomId;
    
    return<div>
        <Canva roomId={roomId} />
    </div>
}