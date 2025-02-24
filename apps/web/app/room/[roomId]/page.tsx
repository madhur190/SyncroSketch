import Canva from "../../../component/ui/Canva";


export default async function Room({params}:{
    params:{
        roomId:string
    }
}){
    const roomId = (await params).roomId;
    return<div>
        <Canva roomId={roomId} />
    </div>
}