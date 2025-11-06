import { Vector2ToKey } from "./Type.js";
var GameMapInstance;
export class GameMap {
    constructor() {
        this.Ants = [];
        this.Foods = [];
        this.Tiles = new Map();
        GameMapInstance = this;
    }
    AddAnt(Ant) {
        this.Ants.push(Ant);
    }
    RemoveAnt(Ant) {
        var Index = this.Ants.findIndex(X => X == Ant);
        if (Index < 0) {
            return;
        }
        this.Ants.splice(Index, 1);
    }
    AddFood(Food) {
        this.Foods.push(Food);
    }
    FindFood(TilePos) {
        for (var i = 0; i < this.Foods.length; i++) {
            var Food = this.Foods[i];
            var FoodPos = Food.GetTilePos();
            if (FoodPos.X == TilePos.X && FoodPos.Y == TilePos.Y) {
                return Food;
            }
        }
        return null;
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
    GetPheromone(Pos, IsHoming = false) {
        var Tile = this.GetTile(Pos);
        if (!Tile) {
            return -1;
        }
        if (IsHoming) {
            return Tile.GetHomingPheromone();
        }
        else {
            return Tile.GetTargetPheromone();
        }
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
        this.Foods.forEach((Food) => {
            Food.Draw();
        });
    }
    Update() {
        this.Ants.forEach((Ant) => {
            Ant.Update();
        });
        this.Tiles.forEach((Tile) => {
            Tile.Update();
        });
    }
}
export function GetInstance() {
    return GameMapInstance;
}
export function Init() {
    new GameMap();
}
