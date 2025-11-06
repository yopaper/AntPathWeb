import { MapObject } from "./MapObject.js";
import * as Canvas from "./Canvas.js";
export class Food extends MapObject {
    Draw() {
        var Context = Canvas.GetCanvasContext();
        if (!Context) {
            return;
        }
        Context.fillStyle = "#0F0";
        Context.fillRect(this.Pos.X - 5, this.Pos.Y - 5, 10, 10);
    }
}
