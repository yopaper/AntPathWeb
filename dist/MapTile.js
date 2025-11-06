import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";
const TileSize = { X: 20, Y: 20 };
export function GetTileSize() {
    return TileSize;
}
export function WorldToTilePos(WorldPos) {
    return { X: ~~(WorldPos.X / GetTileSize().X), Y: ~~(WorldPos.Y / GetTileSize().Y) };
}
export function GetTileLeftTop(Pos) {
    return { X: Pos.X * GetTileSize().X, Y: Pos.Y * GetTileSize().Y };
}
export function GetTileCenter(Pos) {
    const LeftTopPoint = GetTileLeftTop(Pos);
    return { X: LeftTopPoint.X + GetTileSize().X / 2,
        Y: LeftTopPoint.Y + GetTileSize().Y / 2 };
}
;
export class MapTile {
    constructor(TilePos) {
        this.TargetPheromone = 0;
        this.HomingPheromone = 0;
        this.TilePos = TilePos;
    }
    GetTargetPheromone() {
        return this.TargetPheromone;
    }
    GetHomingPheromone() {
        return this.HomingPheromone;
    }
}
export class NormalTile extends MapTile {
    ChangeTargetPheromone(Delta) {
        this.TargetPheromone = Math.max(0, this.TargetPheromone + Delta);
    }
    ChangeHomingPheromone(Delta) {
        this.HomingPheromone = Math.max(0, this.HomingPheromone + Delta);
    }
    Draw() {
        var Context = GetCanvasContext();
        if (!Context) {
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        Context.fillStyle = Type.GetPheromoneColor(this.GetTargetPheromone(), this.GetHomingPheromone());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return true;
    }
    Update() {
        this.ChangeTargetPheromone(-0.02333);
        this.ChangeHomingPheromone(-0.02333);
    }
}
export class Obstacle extends MapTile {
    ChangeTargetPheromone(Delta) {
    }
    ChangeHomingPheromone(Delta) {
    }
    Draw() {
        var Context = GetCanvasContext();
        if (!Context) {
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.lineWidth = 2;
        Context.strokeStyle = Type.GrayColor;
        Context.strokeRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
        Context.fillStyle = Type.BlackColor;
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return false;
    }
    Update() {
    }
}
