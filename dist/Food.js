import { MapObject } from "./MapObject.js";
import * as Canvas from "./Canvas.js";
import { GetInstance } from "./GameMap.js";
export class Food extends MapObject {
    constructor() {
        super(...arguments);
        this.Hp = 5;
    }
    Draw() {
        var Context = Canvas.GetCanvasContext();
        if (!Context) {
            return;
        }
        Context.fillStyle = "#0F0";
        Context.fillRect(this.Pos.X - 5, this.Pos.Y - 5, 10, 10);
    }
    BeEated() {
        this.Hp -= 1;
        if (this.Hp <= 0) {
            GetInstance().RemoveFood(this);
        }
    }
}
