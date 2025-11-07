import { MapObject } from "./MapObject.js";
import * as Canvas from "./Canvas.js";
import { GameMap, GetInstance } from "./GameMap.js";

export class Food extends MapObject{
    Hp:number = 5;
    Draw():void{
        var Context = Canvas.GetCanvasContext();
        if(!Context){
            return;
        }
        Context.fillStyle = "#0F0";
        Context.fillRect(this.Pos.X-5, this.Pos.Y-5, 10, 10);
    }

    BeEated():void{
        this.Hp-=1;
        if(this.Hp<=0){
            GetInstance().RemoveFood(this);
        }
    }
}