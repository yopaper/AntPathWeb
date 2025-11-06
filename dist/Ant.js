import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as AntMovement from "./AntMovement.js";
import * as Canvas from "./Canvas.js";
import * as Pheromone from "./PheromoneHandle.js";
export class Ant {
    constructor(Pos) {
        this.Pos = Pos;
        this.Movement = new AntMovement.AntMovement(this);
        this.PheromoneHandle = new Pheromone.PheromoneHandle(this);
        this.PheromoneHandle.Init();
    }
    GetTilePos() {
        return MapTile.WorldToTilePos(this.Pos);
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
