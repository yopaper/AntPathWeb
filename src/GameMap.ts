import { Ant } from "./Ant.js";
import { MapTile } from "./MapTile.js";
import { Vector2, Vector2ToKey } from "./Type.js";
import * as Food from "./Food.js";
import { PheromoneType } from "./PheromoneContainer.js";

var GameMapInstance:GameMap;

export class GameMap{
    Ants:Ant[] = [];
    Foods:Food.Food[] = [];
    Tiles = new Map<string, MapTile>();

    constructor(){
        GameMapInstance = this;
    }

    AddAnt(Ant:Ant):void{
        this.Ants.push(Ant);
    }

    RemoveAnt(Ant:Ant):void{
        var Index = this.Ants.findIndex(X=>X==Ant);
        if(Index<0){
            return;
        }
        this.Ants.splice(Index, 1);
    }

    AddFood(Food:Food.Food):void{
        this.Foods.push(Food);
    }

    FindFood(TilePos:Vector2):Food.Food|null{
        for(var i=0; i<this.Foods.length; i++){
            var Food = this.Foods[i];
            var FoodPos = Food.GetTilePos();
            if(FoodPos.X==TilePos.X && FoodPos.Y==TilePos.Y){
                return Food;
            }
        }
        return null;
    }

    RemoveFood(Food:Food.Food):void{
        var Index = this.Foods.findIndex(X=>X==Food);
        if(Index<0){
            return;
        }
        this.Foods.splice(Index, 1);
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

    GetPheromone(Pos:Vector2, Type:PheromoneType):number|null{
        if(!this.IsPassable(Pos)){
            return null;
        }
        var Tile = this.GetTile(Pos);
        if(!Tile){
            return null;
        }
        return Tile.GetPheromoneContainer().GetPheromone(Type);
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
        this.Foods.forEach((Food)=>{
            Food.Draw();
        });
    }

    Update():void{
        this.Ants.forEach((Ant)=>{
            Ant.Update();
        });
        this.Tiles.forEach((Tile)=>{
            Tile.Update();
        });
    }
}

export function GetInstance():GameMap{
    return GameMapInstance;
}

export function Init():void{
    new GameMap();
}