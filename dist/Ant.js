import * as Type from "./Type.js";
import * as AntMovement from "./AntMovement.js";
import * as Canvas from "./Canvas.js";
import * as Pheromone from "./PheromoneHandle.js";
import { MapObject } from "./MapObject.js";
export class Ant extends MapObject {
    constructor(TilePos) {
        super(TilePos);
        this.Movement = new AntMovement.AntMovement(this);
        this.PheromoneHandle = new Pheromone.PheromoneHandle(this);
        this.PheromoneHandle.Init();
    }
    ChangePos(DeltaX, DeltaY) {
        this.Pos = { X: this.Pos.X + DeltaX, Y: this.Pos.Y + DeltaY };
    }
    Draw() {
        var Context = Canvas.GetCanvasContext();
        if (!Context) {
            return;
        }
        Context.beginPath();
        Context.fillStyle = Type.BlackColor;
        Context.arc(this.Pos.X, this.Pos.Y, 7, 0, Math.PI * 2);
        Context.fill();
        Context.closePath();
    }
    Update() {
        this.Movement.Update();
    }
}
