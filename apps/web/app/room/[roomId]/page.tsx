import Canva from "../../../component/ui/Canva";

export default async function Room({params}:{
    params:Promise<{ roomId: string }>
}){    
    return<div>
        <Canva roomId={(await params).roomId} />
    </div>
} 