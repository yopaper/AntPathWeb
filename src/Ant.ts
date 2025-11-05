import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";

export class Ant{
    Pos:Type.Vector2 = {X:0, Y:0};

    GetTilePos():Type.Vector2{
        return MapTile.WorldToTilePos(this.Pos);
    }
}