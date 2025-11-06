import { Vector2 } from "./Type.js";
import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";

const TileSize:Vector2 = {X:20, Y:20};

export function GetTileSize():Vector2{
    return TileSize;
}

export function WorldToTilePos(WorldPos:Vector2):Vector2{
    return {X:~~(WorldPos.X/GetTileSize().X), Y:~~(WorldPos.Y/GetTileSize().Y)};
}

export function GetTileLeftTop(Pos:Vector2):Vector2{
    return {X:Pos.X*GetTileSize().X, Y:Pos.Y*GetTileSize().Y};
}

export function GetTileCenter(Pos:Vector2):Vector2{
    const LeftTopPoint = GetTileLeftTop(Pos);
    return {X: LeftTopPoint.X + GetTileSize().X/2,
        Y: LeftTopPoint.Y + GetTileSize().Y/2};
};

export abstract class MapTile{
    TilePos:Vector2;
    TargetPheromone:number = 0;
    HomingPheromone:number = 0;

    constructor(TilePos:Vector2){
        this.TilePos = TilePos;
    }

    GetTargetPheromone():number{
        return this.TargetPheromone;
    }

    GetHomingPheromone():number{
        return this.HomingPheromone;
    }

    abstract ChangeTargetPheromone(Delta:number):void;

    abstract ChangeHomingPheromone(Delta:number):void;

    abstract Draw():void;

    abstract IsPassable():boolean;

    abstract Update():void;
}

export class NormalTile extends MapTile{

    ChangeTargetPheromone(Delta: number): void {
        this.TargetPheromone = Math.max( 0, this.TargetPheromone+Delta );
    }

    ChangeHomingPheromone(Delta: number): void {
        this.HomingPheromone = Math.max( 0, this.HomingPheromone+Delta );
    }

    Draw(): void {
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        
        Context.fillStyle = Type.GetPheromoneColor(this.GetTargetPheromone(), this.GetHomingPheromone());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }

    IsPassable(): boolean {
        return true;
    }

    Update(): void {
        this.ChangeTargetPheromone(-0.02333);
        this.ChangeHomingPheromone(-0.02333);
    }
}

export class Obstacle extends MapTile{
    ChangeTargetPheromone(Delta: number): void {
        // Do nothing
    }

    ChangeHomingPheromone(Delta: number): void {
        // Do nothing
    }

    Draw(): void {
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        
        Context.fillStyle = Type.BlackColor;
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }

    IsPassable(): boolean {
        return false;
    }
    Update(): void {
        
    }
}