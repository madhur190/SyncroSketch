import { Tools } from "../ui/ToolBar"
import GetExistingShapes from "./HttpConnect"

type Shape = {
    type:"rect",
    x:number,
    y:number,
    endX:number,
    endY:number
}|{
    type:"circle"
    x:number
    y:number
    endX:number
    endY:number
}|{
    type:"line",
    startX:number,
    startY:number
    endX:number,
    endY:number
}|{
    type:"text" 
} & inputField|{
    type:"pencil"
    pencilPoints:{x:number,y:number}[]
}|{
    type:"selection"
}

export type inputField = {
    text:string
    x:number
    y:number
}

export class Game{
    canvas:HTMLCanvasElement
    ctx:CanvasRenderingContext2D
    roomId:string
    startX:number
    startY:number
    clicked:boolean
    existingShapes:Shape[]
    socket:WebSocket
    selectedTool:Tools
    inputBoxes:inputField[]
    currentPencilPoints:{x:number,y:number}[]
    setInputBoxes:(boses:inputField[])=>void

    initHandlers(){
        this.socket.onmessage =async (event)=>{
            let rawData: string;
            if (event.data instanceof Blob) {
                rawData = await event.data.text();
            } 
            else if (typeof event.data === "string") {
                rawData = event.data;
            }else {
                console.error("Received non-JSON data:", event.data);
                return;
            }
            try{
                const message = JSON.parse(rawData);
                if(message.type === 'chat'){
                    const parsedShape = (message.message);
                    this.existingShapes.push(parsedShape);
                    this.clearCanvas()
                }
            }
            catch(e){
                console.error("Failed to parse JSON:", rawData, e);
            }
        }
    }

    constructor(canvas:HTMLCanvasElement,roomId:string,inputBoxes:inputField[],setInputBoxes:(boxes:inputField[])=>void,socket:WebSocket){
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
        this.setInputBoxes = setInputBoxes
        this.inputBoxes = inputBoxes
        this.currentPencilPoints = []
        this.socket = socket
        this.init();
        this.initHandlers();
    }

    async init(){
        this.existingShapes = await GetExistingShapes(this.roomId);
        this.clearCanvas();
        const existingBox:inputField[] = [];
        this.existingShapes.forEach(x=>{
            if(!x) return;
            if(x.type === "text"){
                existingBox.push(x);
            }
        })
        this.setInputBoxes(existingBox);
    }   

    clearCanvas(){
        this.ctx.clearRect(0, 0,this.canvas.width,this.canvas.height);
        this.existingShapes.forEach(Shape=>{
            if (!Shape) return;
            this.ctx.strokeStyle = "white";
            if(Shape.type === "rect"){
                const width = Shape.endX-Shape.x;
                const height = Shape.endY-Shape.y;
                this.ctx.strokeRect(Shape.x,Shape.y,width,height);
            }
            else if(Shape.type === "line"){
                this.ctx.beginPath();
                this.ctx.moveTo(Shape.startX,Shape.startY)
                this.ctx.lineTo(Shape.endX,Shape.endY)
                this.ctx.stroke();
            }
            else if(Shape.type === "pencil"){
                this.ctx.beginPath();
                if(!Shape.pencilPoints[0]) return;
                this.ctx.moveTo(Shape.pencilPoints[0]?.x,Shape.pencilPoints[0]?.y);
                Shape.pencilPoints.forEach(point=>{
                    this.ctx.lineTo(point.x,point.y);
                    this.ctx.stroke();
                })
                this.ctx.closePath();
            }
            else if(Shape.type === "circle"){
                this.ctx.beginPath();
                this.ctx.ellipse((Shape.x+Shape.endX)/2,(Shape.y+Shape.endY)/2,Math.abs(Shape.x-Shape.endX)/2,Math.abs(Shape.y-Shape.endY)/2,0,0,2*Math.PI)
                this.ctx.stroke()
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
        if(this.selectedTool === "pencil"){
            this.currentPencilPoints.push({x:this.startX,y:this.startY})
            this.ctx.beginPath();
            this.ctx.strokeStyle = "white";
            this.ctx.moveTo(this.startX,this.startY)
            this.ctx.stroke();
            this.ctx.closePath();
        }
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
        else if(this.selectedTool === "pencil"){
            if(this.currentPencilPoints.length>0){
                this.ctx.beginPath();
                if(!this.currentPencilPoints[0]) return;
                this.ctx.moveTo(this.currentPencilPoints[0]?.x,this.currentPencilPoints[0]?.y);
                this.currentPencilPoints.forEach(point=>{
                    this.ctx.lineTo(point.x,point.y);
                    this.ctx.stroke();
                })
                this.ctx.closePath();
            }
            this.currentPencilPoints.push({ x: currentX, y: currentY });
            this.ctx.beginPath();
            this.ctx.moveTo(currentX, currentY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke()
        }
        else if(this.selectedTool === "circle"){
            this.ctx.beginPath();
            this.ctx.ellipse((this.startX+currentX)/2,(this.startY+currentY)/2,Math.abs(this.startX-currentX)/2,Math.abs(this.startY-currentY)/2,0,0,2*Math.PI)
            this.ctx.stroke()
        }
        else if(this.selectedTool === "eraser"){
            const shape = this.isCollidingShape(currentX,currentY);
            if(shape){
                if(shape.type === 'text'){
                    const toDelete = {
                        text:shape.text,
                        x:shape.x,
                        y:shape.y
                    };
                    const updatedBox = this.inputBoxes.filter(s => {
                        return !(s.x === shape.x && s.y === shape.y && s.text === shape.text);
                    });
                    this.inputBoxes = updatedBox;
                    this.setInputBoxes(updatedBox);
                }
                this.existingShapes = this.existingShapes.filter(s => s !== shape);
                this.socket.send(JSON.stringify({
                    type:"delete_chat",
                    roomId:this.roomId,
                    message:shape
                }))
            }
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
                endX,
                endY
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
        else if(this.selectedTool === "text"){
            shape = {
                type:"text",
                text:"",
                x:this.startX,
                y:this.startY
            }
            this.inputBoxes.push({ text: "", x: this.startX, y: this.startY });
            this.setInputBoxes([...this.inputBoxes]);
        }
        else if(this.selectedTool === "pencil"){
            this.currentPencilPoints.push({ x: endX, y: endY });
            this.ctx.closePath();
            shape = {
                type:"pencil",
                pencilPoints: [...this.currentPencilPoints]
            }
            this.currentPencilPoints = [];
        }
        else if(this.selectedTool === "circle"){
            shape = {
               type:"circle",
               x:this.startX,
               y:this.startY,
               endX,
               endY
            }
        }
        if(!shape) return;
        const message = JSON.stringify({
            type:"chat",
            roomId:this.roomId,
            message:shape
        })
        this.socket.send(message);
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

    updateText(box: inputField, value: string) {
        this.existingShapes.forEach(shape=>{
            if(shape.type === "text" && shape.x === box.x && shape.y === box.y){
                shape.text = box.text
            }
        })
        this.clearCanvas();
    }

    isCollidingShape(xCord:number,yCord:number):Shape|null{
        const tollerence = 5;
        for(const Shape of this.existingShapes){
            if(Shape.type === "rect"){
                
                if (
                    (xCord >= Shape.x - 2 && xCord <= Shape.endX + 2 && 
                    (Math.abs(yCord - Shape.y) < 2 || Math.abs(yCord - Shape.endY) < 2)) || 
                    (yCord >= Shape.y - 2 && yCord <= Shape.endY + 2 &&
                    (Math.abs(xCord - Shape.x) < 2 || Math.abs(xCord - Shape.endX) < 2))
                ){
                    return Shape;
                }
            }
            else if(Shape.type === "line"){
                function linepointNearestMouse(line:{
                    x0:number,x1:number,y0:number,y1:number
                }, x:number, y:number) {
                    const lerp = function(a:number, b:number, x:number) {
                        return (a + x * (b - a));
                    };
                    var dx = line.x1 - line.x0;
                    var dy = line.y1 - line.y0;
                    var t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
                    var lineX = lerp(line.x0, line.x1, t);
                    var lineY = lerp(line.y0, line.y1, t);
                    return ({
                        x: lineX,
                        y: lineY
                    });
                };
                const linepoint = linepointNearestMouse({x0:Shape.startX,x1:Shape.endX,y0:Shape.startY,y1:Shape.endY}, xCord, yCord);
                const dx = xCord - linepoint.x;
                const dy = yCord - linepoint.y;
                if(Math.abs(Math.sqrt(dx * dx + dy * dy))<tollerence){
                    return Shape;
                }
            }
            else if(Shape.type === "pencil"){
                for(const point of Shape.pencilPoints){
                    if(Math.abs(xCord - point.x) < 5 && Math.abs(yCord - point.y) < 5){
                        return Shape;
                    }
                }
            }
            else if(Shape.type === "text"){
                if(
                    xCord >= Shape.x - tollerence &&
                    xCord <= (Shape.x + (Shape.x+this.ctx.measureText(Shape.text).width) + tollerence) &&
                    Math.abs(yCord - Shape.y) < tollerence
                ){
                    return Shape;
                }
            }
            else if(Shape.type === "circle"){
                const cx = (Shape.x + Shape.endX) / 2;
                const cy = (Shape.y + Shape.endY) / 2;
                const radiusX = Math.abs(Shape.endX - Shape.x) / 2;
                const radiusY = Math.abs(Shape.endY - Shape.y) / 2;
                const r = (radiusX + radiusY) / 2;
                const dx = xCord - cx;
                const dy = yCord - cy;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (Math.abs(distance - r) < tollerence) {
                    return Shape;
                }
            }
        }
        return null;
    }
    
}