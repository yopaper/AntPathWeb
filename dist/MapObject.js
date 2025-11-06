import * as MapTile from "./MapTile.js";
export class MapObject {
    constructor(TilePos) {
        this.Pos = MapTile.GetTileCenter(TilePos);
    }
    GetTilePos() {
        return MapTile.WorldToTilePos(this.Pos);
    }
}
