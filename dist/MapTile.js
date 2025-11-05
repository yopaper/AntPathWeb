import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";
const TileSize = { X: 30, Y: 30 };
export function GetTileSize() {
    return TileSize;
}
export function GetTileLeftTop(Pos) {
    return { X: Pos.X * GetTileSize().X, Y: Pos.Y * GetTileSize().Y };
}
export class MapTile {
    constructor() {
        this.Pheromone = 0;
    }
    GetPheromone() {
        return this.Pheromone;
    }
}
export class NormalTile extends MapTile {
    ChangePheromone(Delta) {
        this.Pheromone = Math.max(0, this.Pheromone + Delta);
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
        Context.fillStyle = Type.GetPheromoneColor(this.GetPheromone());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return true;
    }
}
