import { Vector2ToKey } from "./Type.js";
var GameMapInstance;
export class GameMap {
    constructor() {
        this.Ants = [];
        this.Tiles = new Map();
        GameMapInstance = this;
    }
    AddAnt(Ant) {
        this.Ants.push(Ant);
    }
    AddTile(Tile) {
        if (this.HasTile(Tile.TilePos)) {
            return;
        }
        this.Tiles.set(Vector2ToKey(Tile.TilePos), Tile);
    }
    HasTile(Pos) {
        return this.Tiles.has(Vector2ToKey(Pos));
    }
    GetTile(Pos) {
        if (!this.HasTile(Pos)) {
            return null;
        }
        return this.Tiles.get(Vector2ToKey(Pos));
    }
    IsPassable(Pos) {
        if (!this.HasTile(Pos)) {
            return false;
        }
        var Tile = this.GetTile(Pos);
        if (!Tile) {
            return false;
        }
        return Tile.IsPassable();
    }
    Draw() {
        this.Tiles.forEach((Tile) => {
            Tile.Draw();
        });
        this.Ants.forEach((Ant) => {
            Ant.Draw();
        });
    }
    Update() {
        this.Ants.forEach((Ant) => {
            Ant.Update();
        });
    }
}
export function GetInstance() {
    return GameMapInstance;
}
export function Init() {
    new GameMap();
}
