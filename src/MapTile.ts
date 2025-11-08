import { Vector2 } from "./Type.js";
import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";
import * as PheromoneContainer from "./PheromoneContainer.js";

const TileSize:Vector2 = {X:15, Y:15};

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
    PheromoneContainer:PheromoneContainer.PheromoneContainer;
    TargetPheromone:number = 0;
    HomingPheromone:number = 0;

    constructor(TilePos:Vector2){
        this.TilePos = TilePos;
        this.PheromoneContainer = new PheromoneContainer.PheromoneContainer();
    }

    GetPheromoneContainer():PheromoneContainer.PheromoneContainer{
        return this.PheromoneContainer;
    }

    abstract Draw():void;

    abstract IsPassable():boolean;

    abstract Update():void;
}

export class NormalTile extends MapTile{

    Draw(): void {
        var Context = GetCanvasContext();
        if(!Context){
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.fillStyle = Type.GetPheromoneColor(this.GetPheromoneContainer());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }

    IsPassable(): boolean {
        return true;
    }

    Update(): void {
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Target, -0.01333);
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Explore, -0.01333);
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Homing, -0.01333);
    }
}

export class Obstacle extends MapTile{

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