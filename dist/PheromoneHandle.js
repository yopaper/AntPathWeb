import * as GameMap from "./GameMap.js";
export class PheromoneHandle {
    constructor(Owner) {
        this.PathQueue = [];
        this.QueueMax = 10;
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
    ApplyPheromone(IsHoming, MaxPheromone = 10) {
        var MapInstance = GameMap.GetInstance();
        for (var i = 0; i < this.PathQueue.length; i++) {
            var Pos = this.PathQueue[i];
            var Tile = MapInstance.GetTile(Pos);
            var Rate = (i + 1) / this.PathQueue.length;
            if (!Tile) {
                continue;
            }
            if (IsHoming) {
                Tile.ChangeHomingPheromone(MaxPheromone * Rate);
            }
            else {
                Tile.ChangeTargetPheromone(MaxPheromone * Rate);
            }
        }
    }
    OnMovementTilePosChanged(NewPos, OldPos, IsHoming) {
        this.PushPos(OldPos);
        var MapInstance = GameMap.GetInstance();
        var NewPosPheromone = MapInstance.GetPheromone(NewPos, IsHoming);
        if (MapInstance.GetPheromone(OldPos, IsHoming) <= 0 && NewPosPheromone > 0) {
            this.ApplyPheromone(IsHoming, NewPosPheromone * 0.966);
        }
    }
}
