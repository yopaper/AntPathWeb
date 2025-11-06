import { Ant } from "./Ant.js";
import { MapTile } from "./MapTile.js";
import { Vector2, Vector2ToKey } from "./Type.js";

var GameMapInstance:GameMap;

export class GameMap{
    Ants:Ant[] = [];
    Tiles = new Map<string, MapTile>();

    constructor(){
        GameMapInstance = this;
    }

    AddAnt(Ant:Ant):void{
        this.Ants.push(Ant);
    }

    AddTile(Tile:MapTile) {
        if(this.HasTile(Tile.TilePos)){
            return;
        }
        this.Tiles.set(Vector2ToKey(Tile.TilePos), Tile);
    }

    HasTile(Pos:Vector2):boolean{
        return this.Tiles.has( Vector2ToKey(Pos) );
    }

    GetTile(Pos:Vector2):MapTile|null{
        if(!this.HasTile(Pos)){
            return null;
        }
        return this.Tiles.get(Vector2ToKey(Pos))as MapTile;
    }

    IsPassable(Pos:Vector2):boolean{
        if(!this.HasTile(Pos)){
            return false;
        }
        var Tile = this.GetTile(Pos);
        if(!Tile){
            return false;
        }
        return Tile.IsPassable();
    }

    Draw():void{
        this.Tiles.forEach((Tile) => {
            Tile.Draw();
        });
        this.Ants.forEach((Ant)=>{
            Ant.Draw();
        });
    }

    Update():void{
        this.Ants.forEach((Ant)=>{
            Ant.Update();
        });
    }
}

export function GetInstance():GameMap{
    return GameMapInstance;
}

export function Init():void{
    new GameMap();
}