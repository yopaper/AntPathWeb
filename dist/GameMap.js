var GameMapInstance;
export class GameMap {
    constructor() {
        this.Tiles = new Map();
        GameMapInstance = this;
    }
    AddTile(Pos, Tile) {
        if (this.HasTile(Pos)) {
            return;
        }
        this.Tiles.set(Pos, Tile);
    }
    HasTile(Pos) {
        return this.Tiles.has(Pos);
    }
    IsPassable(Pos) {
        if (!this.HasTile(Pos)) {
            return false;
        }
        var Tile = this.Tiles.get(Pos);
        if (!Tile) {
            return false;
        }
        return Tile.IsPassable();
    }
    Draw() {
        this.Tiles.forEach((Tile, Pos) => {
            Tile.Draw(Pos);
        });
    }
}
export function GetInstance() {
    return GameMapInstance;
}
export function Init() {
    new GameMap();
}
