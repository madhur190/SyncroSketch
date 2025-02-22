import { Pencil, Shapes } from "lucide-react"
import { Tools } from "../ui/ToolBar"

type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
}|{
    type:"circle"
}|{
    type:"line",
    startX:number,
    startY:number
    endX:number,
    endY:number
}|{
    type:"text"
}|{
    type:"pencil"
}

export class Game{
    canvas:HTMLCanvasElement
    ctx:CanvasRenderingContext2D
    roomId:string
    startX:number
    startY:number
    clicked:boolean
    existingShapes:Shape[]
    selectedTool:Tools

    constructor(canvas:HTMLCanvasElement,roomId:string){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId
        this.canvas.height = window.innerHeight
        this.canvas.width = window.innerWidth
        this.startX = 0;
        this.startY = 0;
        this.clicked = false
        this.existingShapes = [];
        this.selectedTool = "pencil"
        this.initMouseHandlers();
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0,this.canvas.width,this.canvas.height);
        this.existingShapes.forEach(Shape=>{
        this.ctx.strokeStyle = "white";
            if(Shape.type == "rect"){
                this.ctx.strokeRect(Shape.x,Shape.y,Shape.width,Shape.height);
            }
            else if(Shape.type == "line"){
                this.ctx.beginPath();
                this.ctx.moveTo(Shape.startX,Shape.startY)
                this.ctx.lineTo(Shape.endX,Shape.endY)
                this.ctx.stroke();
            }
        })
    }

    setTool(tool:Tools){
        this.selectedTool = tool
    }

    mouseDownHandler = (e:MouseEvent)=>{
        this.clicked = true
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    }
    
    mouseMoveHandler = (e:MouseEvent)=>{
        if(!this.clicked)return;
        this.clearCanvas();
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        if(this.selectedTool === "rect"){
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            this.ctx.strokeRect(this.startX,this.startY,width,height)
        }
        else if(this.selectedTool === "line"){
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX,this.startY)
            this.ctx.lineTo(currentX,currentY)
            this.ctx.stroke();
        }
    }

    mouseUpHandler = (e:MouseEvent)=>{
        this.clicked = false
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        let shape:Shape|null = null;
        if(this.selectedTool === "rect"){
            shape = {
                type:"rect",
                x:this.startX,
                y:this.startY,
                width:endX - this.startX,
                height:endY - this.startY
            }
        }
        else if(this.selectedTool === "line"){
            shape = {
                type:"line",
                startX:this.startX,
                startY:this.startY,
                endX:endX,
                endY:endY
            }
        }
        if(!shape) return;
        this.existingShapes.push(shape);
        this.clearCanvas();
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
        this.canvas.addEventListener("mouseup",this.mouseUpHandler);
    }

    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);
    }
}