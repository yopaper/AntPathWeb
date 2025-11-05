
var Canvas:HTMLCanvasElement|null;
var CanvasContext:CanvasRenderingContext2D|null;

export function GetCanvas():HTMLCanvasElement|null
{
    return Canvas;
}

export function GetCanvasContext():CanvasRenderingContext2D|null
{
    return CanvasContext;
}

export function Init():void
{
    window.addEventListener("load", () => {
    Canvas = document.createElement("canvas");
    Canvas.width = 500;
    Canvas.height = 500;
    Canvas.style.border = "1px solid black";
    document.body.appendChild(Canvas);
    if(Canvas!=null){
        CanvasContext = Canvas.getContext("2d");
    }
    console.log("Canvas Loaded!");
    });
}