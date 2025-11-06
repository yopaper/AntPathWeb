import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";

export abstract class MapObject{
    Pos:Type.Vector2;

    constructor(TilePos:Type.Vector2){
        this.Pos = MapTile.GetTileCenter(TilePos);
    }

    GetTilePos():Type.Vector2{
        return MapTile.WorldToTilePos(this.Pos);
    }
}