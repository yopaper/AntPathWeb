import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as AntMovement from "./AntMovement.js";
import * as Canvas from "./Canvas.js";
import * as Pheromone from "./PheromoneHandle.js";

export class Ant{
    Pos:Type.Vector2;
    Movement:AntMovement.AntMovement;
    PheromoneHandle:Pheromone.PheromoneHandle;

    constructor(Pos:Type.Vector2){
        this.Pos = Pos;
        this.Movement = new AntMovement.AntMovement(this);
        this.PheromoneHandle = new Pheromone.PheromoneHandle(this);

        this.PheromoneHandle.Init();
    }

    GetTilePos():Type.Vector2{
        return MapTile.WorldToTilePos(this.Pos);
    }

    ChangePos(DeltaX:number, DeltaY:number):void{
        this.Pos = {X: this.Pos.X+DeltaX, Y:this.Pos.Y+DeltaY};
    }

    Draw():void{
        var Context = Canvas.GetCanvasContext();
        if(!Context){
            return;
        }
        Context.beginPath();
        Context.fillStyle = Type.BlackColor;
        Context.arc(this.Pos.X, this.Pos.Y, 7, 0, Math.PI*2);
        Context.fill();
        Context.closePath();
    }

    Update():void{
        this.Movement.Update();
        //console.log(`${this.Pos.X}, ${this.Pos.Y}`);
    }
}