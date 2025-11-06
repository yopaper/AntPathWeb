import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";
const TileSize = { X: 30, Y: 30 };
export function GetTileSize() {
    return TileSize;
}
export function WorldToTilePos(WorldPos) {
    return { X: Math.floor(WorldPos.X / GetTileSize().X), Y: Math.floor(WorldPos.Y / GetTileSize().Y) };
}
export function GetTileLeftTop(Pos) {
    return { X: Pos.X * GetTileSize().X, Y: Pos.Y * GetTileSize().Y };
}
export class MapTile {
    constructor() {
        this.TargetPheromone = 0;
        this.HomingPheromone = 0;
    }
    GetTargetPheromone() {
        return this.TargetPheromone;
    }
}
export class NormalTile extends MapTile {
    ChangeTargetPheromone(Delta) {
        this.TargetPheromone = Math.max(0, this.TargetPheromone + Delta);
    }
    Draw(Pos) {
        var Context = GetCanvasContext();
        if (!Context) {
            return;
        }
        var LTPoint = GetTileLeftTop(Pos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        Context.fillStyle = Type.GetPheromoneColor(this.GetTargetPheromone());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return true;
    }
}
export class Obstacle extends MapTile {
    ChangeTargetPheromone(Delta) {
    }
    Draw(Pos) {
        var Context = GetCanvasContext();
        if (!Context) {
            return;
        }
        var LTPoint = GetTileLeftTop(Pos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        Context.fillStyle = Type.BlackColor;
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return false;
    }
}
