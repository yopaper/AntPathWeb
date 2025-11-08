import { Ant } from "./Ant.js";
import { GetCanvasContext } from "./Canvas.js";
import { GetMapInstance } from "./GameMap.js";
import { MapObject } from "./MapObject.js";
import { GetTileSize } from "./MapTile.js";
import { Vector2 } from "./Type.js";

export class AntNest extends MapObject{

    GetNestSize():Vector2{
        return {X: GetTileSize().X*0.9, Y:GetTileSize().Y*0.9};
    }

    Update():void{
        const SpawnAnt = ():void=>{
            if(Math.random()>0.1097){
                return;
            }
            var GameMapInstance = GetMapInstance();
            GameMapInstance.AddAnt( new Ant(this.GetTilePos()) );
        };
        SpawnAnt();
    }

    Draw():void{
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        Context.beginPath();
        Context.moveTo(this.Pos.X + this.GetNestSize().X/2, this.Pos.Y);
        Context.lineTo(this.Pos.X, this.Pos.Y + this.GetNestSize().Y/2);
        Context.lineTo(this.Pos.X - this.GetNestSize().X/2, this.Pos.Y);
        Context.lineTo(this.Pos.X, this.Pos.Y - this.GetNestSize().Y/2);
        Context.lineTo(this.Pos.X + this.GetNestSize().X/2, this.Pos.Y);
        Context.strokeStyle = "#F80";
        Context.stroke();
        Context.closePath();
    }
}