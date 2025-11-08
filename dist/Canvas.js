var Canvas;
var CanvasContext;
export function GetCanvas() {
    return Canvas;
}
export function GetCanvasContext() {
    return CanvasContext;
}
export function ClearCanvas() {
    if (!Canvas) {
        return;
    }
    if (!CanvasContext) {
        return;
    }
    CanvasContext.fillStyle = "#000";
    CanvasContext.fillRect(0, 0, Canvas.width, Canvas.height);
}
export function Init() {
    window.addEventListener("load", () => {
        Canvas = document.createElement("canvas");
        Canvas.width = 1500;
        Canvas.height = 1500;
        Canvas.style.border = "1px solid black";
        document.body.appendChild(Canvas);
        if (Canvas != null) {
            CanvasContext = Canvas.getContext("2d");
        }
        console.log("Canvas Loaded!");
    });
}
