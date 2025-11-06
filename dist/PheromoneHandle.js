import * as GameMap from "./GameMap.js";
export class PheromoneHandle {
    constructor(Owner) {
        this.Owner = Owner;
    }
    Init() {
        this.Owner.Movement.OnTilePosChangedDelegate.push(this.OnMovementTilePosChanged);
    }
    OnMovementTilePosChanged(NewPos, OldPos, IsHoming) {
        var MapInstance = GameMap.GetInstance();
        var Tile = MapInstance.GetTile(OldPos);
        if (!Tile) {
            return;
        }
        if (!IsHoming) {
            Tile.ChangeHomingPheromone(1);
        }
        else {
            Tile.ChangeTargetPheromone(1);
        }
    }
}
