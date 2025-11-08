import { MapObject } from "./MapObject.js";
import * as Canvas from "./Canvas.js";
import { GetMapInstance } from "./GameMap.js";
export class Food extends MapObject {
    constructor() {
        super(...arguments);
        this.Hp = 15;
        this.Size = 8;
    }
    Draw() {
        var Context = Canvas.GetCanvasContext();
        if (!Context) {
            return;
        }
        const HalfSize = this.Size / 2;
        Context.fillStyle = "#0F0";
        Context.fillRect(this.Pos.X - HalfSize, this.Pos.Y - HalfSize, this.Size, this.Size);
        Context.strokeStyle = "#080";
        Context.lineWidth = 0;
        Context.strokeRect(this.Pos.X - HalfSize, this.Pos.Y - HalfSize, this.Size, this.Size);
    }
    BeEated() {
        this.Hp -= 1;
        if (this.Hp <= 0) {
            GetMapInstance().RemoveFood(this);
        }
    }
}
