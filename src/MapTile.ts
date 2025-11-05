import { Vector2 } from "./Type.js";
import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";

const TileSize:Vector2 = {X:30, Y:30};

export function GetTileSize():Vector2{
    return TileSize;
}

export function WorldToTilePos(WorldPos:Vector2):Vector2{
    return {X:Math.floor(WorldPos.X/GetTileSize().X), Y:Math.floor(WorldPos.Y/GetTileSize().Y)};
}

export function GetTileLeftTop(Pos:Vector2):Vector2{
    return {X:Pos.X*GetTileSize().X, Y:Pos.Y*GetTileSize().Y};
}

export abstract class MapTile{
    Pheromone:number = 0;

    GetPheromone():number{
        return this.Pheromone;
    }

    abstract ChangePheromone(Delta:number):void

    abstract Draw(Pos:Vector2):void;

    abstract IsPassable():boolean;
}

export class NormalTile extends MapTile{
    ChangePheromone(Delta: number): void {
        this.Pheromone = Math.max( 0, this.Pheromone+Delta );
    }
    Draw(Pos: Vector2): void {
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        var LTPoint = GetTileLeftTop(Pos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        
        Context.fillStyle = Type.GetPheromoneColor(this.GetPheromone());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable(): boolean {
        return true;
    }
}

export class Obstacle extends MapTile{
    ChangePheromone(Delta: number): void {
        // Do nothing
    }

    Draw(Pos: Vector2): void {
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        var LTPoint = GetTileLeftTop(Pos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        
        Context.fillStyle = Type.BlackColor;
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }

    IsPassable(): boolean {
        return false;
    }
}