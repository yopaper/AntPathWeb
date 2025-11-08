import { GetCanvasContext } from "./Canvas.js";
import * as Type from "./Type.js";
import * as PheromoneContainer from "./PheromoneContainer.js";
const TileSize = { X: 15, Y: 15 };
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
        this.PheromoneContainer = new PheromoneContainer.PheromoneContainer();
    }
    GetPheromoneContainer() {
        return this.PheromoneContainer;
    }
}
export class NormalTile extends MapTile {
    Draw() {
        var Context = GetCanvasContext();
        if (!Context) {
            return;
        }
        var LTPoint = GetTileLeftTop(this.TilePos);
        Context.fillStyle = Type.GetPheromoneColor(this.GetPheromoneContainer());
        Context.fillRect(LTPoint.X, LTPoint.Y, GetTileSize().X, GetTileSize().Y);
    }
    IsPassable() {
        return true;
    }
    Update() {
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Target, -0.01333);
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Explore, -0.01333);
        this.PheromoneContainer.ChangePheromone(PheromoneContainer.PheromoneType.Homing, -0.01333);
    }
}
export class Obstacle extends MapTile {
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
