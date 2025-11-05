import { MapTile } from "./MapTile";
import { Vector2 } from "./Type";

var GameMapInstance:GameMap;

export class GameMap{
    Tiles = new Map<Vector2, MapTile>();

    constructor(){
        GameMapInstance = this;
    }

    AddTile(Pos:Vector2, Tile:MapTile) {
        if(this.HasTile(Pos)){
            return;
        }
        this.Tiles.set(Pos, Tile);
    }

    HasTile(Pos:Vector2):boolean{
        return this.Tiles.has(Pos);
    }

    IsPassable(Pos:Vector2):boolean{
        if(!this.HasTile(Pos)){
            return false;
        }
        var Tile = this.Tiles.get(Pos);
        if(!Tile){
            return false;
        }
        return Tile.IsPassable();
    }

    Draw():void{
        this.Tiles.forEach((Tile, Pos) => {
            Tile.Draw(Pos);
        });
    }
}

export function GetInstance():GameMap{
    return GameMapInstance;
}

export function Init():void{
    new GameMap();
}