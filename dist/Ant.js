import * as MapTile from "./MapTile.js";
export class Ant {
    constructor() {
        this.Pos = { X: 0, Y: 0 };
    }
    GetTilePos() {
        return MapTile.WorldToTilePos(this.Pos);
    }
}
