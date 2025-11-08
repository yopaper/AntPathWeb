import { Vector2ToKey } from "./Type.js";
var GameMapInstance;
export class GameMap {
    constructor() {
        this.Ants = [];
        this.Foods = [];
        this.AntNests = [];
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
    RemoveFood(Food) {
        var Index = this.Foods.findIndex(X => X == Food);
        if (Index < 0) {
            return;
        }
        this.Foods.splice(Index, 1);
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
    GetPheromone(Pos, Type) {
        if (!this.IsPassable(Pos)) {
            return null;
        }
        var Tile = this.GetTile(Pos);
        if (!Tile) {
            return null;
        }
        return Tile.GetPheromoneContainer().GetPheromone(Type);
    }
    FindAntNest(TilePos) {
        for (var i = 0; i < this.AntNests.length; i++) {
            var Nest = this.AntNests[i];
            var NestPos = Nest.GetTilePos();
            if (NestPos.X == TilePos.X && NestPos.Y == TilePos.Y) {
                return Nest;
            }
        }
        return null;
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
    AddAntNest(AntNest) {
        this.AntNests.push(AntNest);
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
        this.AntNests.forEach((Nest) => {
            Nest.Draw();
        });
    }
    Update() {
        this.Ants.forEach((Ant) => {
            Ant.Update();
        });
        this.Tiles.forEach((Tile) => {
            Tile.Update();
        });
        this.AntNests.forEach((Nest) => {
            Nest.Update();
        });
    }
}
export function GetMapInstance() {
    return GameMapInstance;
}
export function Init() {
    new GameMap();
}
