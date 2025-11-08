import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as AntMovement from "./AntMovement.js";
import * as Canvas from "./Canvas.js";
import * as Pheromone from "./PheromoneHandle.js";
import { MapObject } from "./MapObject.js";

export class Ant extends MapObject{
    Movement:AntMovement.AntMovement;
    PheromoneHandle:Pheromone.PheromoneHandle;

    constructor(TilePos:Type.Vector2){
        super(TilePos);
        this.Movement = new AntMovement.AntMovement(this);
        this.PheromoneHandle = new Pheromone.PheromoneHandle(this);

        this.PheromoneHandle.Init();
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
        if(this.Movement.IsHoming){
            Context.fillStyle = "#D60";
        }else{
            Context.fillStyle = "#0A0";
        }
        
        Context.arc(this.Pos.X, this.Pos.Y, 4, 0, Math.PI*2);
        Context.fill();
        Context.closePath();
    }

    Update():void{
        this.Movement.Update();
    }
}