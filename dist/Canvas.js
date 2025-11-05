var Canvas;
var CanvasContext;
export function GetCanvas() {
    return Canvas;
}
export function GetCanvasContext() {
    return CanvasContext;
}
export function Init() {
    window.addEventListener("load", () => {
        Canvas = document.createElement("canvas");
        Canvas.width = 500;
        Canvas.height = 500;
        Canvas.style.border = "1px solid black";
        document.body.appendChild(Canvas);
        if (Canvas != null) {
            CanvasContext = Canvas.getContext("2d");
        }
        console.log("Canvas Loaded!");
    });
}
