import * as GameMap from "./GameMap.js";
import { PheromoneType } from "./PheromoneContainer.js";
export class PheromoneHandle {
    constructor(Owner) {
        this.PathQueue = [];
        this.QueueMax = 50;
        this.Owner = Owner;
    }
    Init() {
        this.Owner.Movement.OnTilePosChangedDelegate.push(this.OnMovementTilePosChanged.bind(this));
    }
    PushPos(PathPos) {
        this.PathQueue.push(PathPos);
        if (this.PathQueue.length > this.QueueMax) {
            this.PathQueue.shift();
        }
    }
    ApplyPheromone(PheromoneType, MaxPheromone = 10) {
        var MapInstance = GameMap.GetMapInstance();
        for (var i = 0; i < this.PathQueue.length; i++) {
            var Pos = this.PathQueue[i];
            var Tile = MapInstance.GetTile(Pos);
            var Rate = (i + 1) / this.PathQueue.length;
            if (!Tile) {
                continue;
            }
            Tile.GetPheromoneContainer().SetClampPheromone(PheromoneType, MaxPheromone * Rate);
        }
    }
    OnMovementTilePosChanged(NewPos, OldPos, IsHoming) {
        this.PushPos(OldPos);
        var MapInstance = GameMap.GetMapInstance();
        var Tile = MapInstance.GetTile(OldPos);
        if (Tile) {
            Tile.GetPheromoneContainer().SetClampPheromone(PheromoneType.Explore, 1);
            Tile.GetPheromoneContainer().ChangePheromone(PheromoneType.Target, -0.1);
        }
    }
}
