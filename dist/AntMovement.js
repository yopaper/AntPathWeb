import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as GameMap from "./GameMap.js";
export class AntMovement {
    constructor(Owner) {
        this.TargetTilePos = { X: 0, Y: 0 };
        this.TargetWorldPos = { X: 0, Y: 0 };
        this.IsHoming = false;
        this.OnTilePosChangedDelegate = [];
        this.Speed = 5;
        this.Owner = Owner;
        this.TargetTilePos = Owner.GetTilePos();
        this.TargetWorldPos = MapTile.GetTileCenter(Owner.GetTilePos());
        this.Direction = Type.GetRandomDirection();
        console.log(`Direction: ${this.Direction.X}, ${this.Direction.Y}`);
    }
    PickNextTarget() {
        console.log("PickNextTarget");
        const MapInstance = GameMap.GetInstance();
        const Rotator = Type.GetDirectionRotator(this.Direction, this.TargetTilePos);
        const PickPheromone = (PheromoneGetter) => {
            var Rotator = Type.GetDirectionRotator(this.Direction, this.TargetTilePos);
            const MapInstance = GameMap.GetInstance();
            var PheromoneSum = 0;
            var PosList = [];
            var PheromoneList = [];
            const CalPheromoneValue = (TilePos, Rate, Base) => {
                var Tile = MapInstance.GetTile(TilePos);
                if (!Tile) {
                    return;
                }
                if (!Tile.IsPassable()) {
                    return;
                }
                var PheromoneValue = PheromoneGetter(Tile);
                PheromoneValue *= Rate;
                PheromoneValue += Base;
                PosList.push(TilePos);
                PheromoneList.push(PheromoneValue + PheromoneSum);
                PheromoneSum += PheromoneValue;
            };
            CalPheromoneValue(Rotator.ForwardPos, 1, 1);
            CalPheromoneValue(Rotator.LeftPos, 1, 1);
            CalPheromoneValue(Rotator.RightPos, 1, 1);
            if (PosList.length > 0) {
                console.log(PosList);
                console.log(PheromoneList);
                console.log(PheromoneSum);
                var Random = Math.random() * PheromoneSum;
                console.log(Random);
                var OutTilePos = { X: 0, Y: 0 };
                PheromoneList.forEach((Pheromone, Index) => {
                    if (Random <= Pheromone) {
                        OutTilePos = PosList[Index];
                    }
                });
                console.log(Type.Vector2ToKey(OutTilePos));
                return OutTilePos;
            }
            if (MapInstance.IsPassable(Rotator.BackwardPos)) {
                return Rotator.Backward;
            }
            return this.TargetTilePos;
        };
        const PickTargetPheromone = () => {
            return PickPheromone((Tile) => {
                return Tile.GetTargetPheromone();
            });
        };
        const PickHomingPheromone = () => {
            return PickPheromone((Tile) => {
                return Tile.GetHomingPheromone();
            });
        };
        if (Math.random() < 0.9 && MapInstance.IsPassable(Rotator.ForwardPos)) {
            this.SetTilePos(Rotator.ForwardPos);
        }
        else if (Math.random() < 0.5 && MapInstance.IsPassable(Rotator.RightPos)) {
            this.SetTilePos(Rotator.RightPos);
        }
        else if (MapInstance.IsPassable(Rotator.LeftPos)) {
            this.SetTilePos(Rotator.LeftPos);
        }
        else if (MapInstance.IsPassable(Rotator.BackwardPos)) {
            this.SetTilePos(Rotator.BackwardPos);
        }
    }
    SetTilePos(TilePos) {
        if (this.TargetTilePos.X == TilePos.X && this.TargetTilePos.Y == TilePos.Y) {
            return;
        }
        if (Math.abs(TilePos.X - this.TargetTilePos.X) + Math.abs(TilePos.Y - this.TargetTilePos.Y) > 1) {
            return;
        }
        this.OnTilePosChangedDelegate.forEach((Delegate) => {
            Delegate(TilePos, this.TargetTilePos, this.IsHoming);
        });
        this.Direction = { X: TilePos.X - this.TargetTilePos.X, Y: TilePos.Y - this.TargetTilePos.Y };
        this.TargetTilePos = TilePos;
        this.TargetWorldPos = MapTile.GetTileCenter(TilePos);
        console.log(`Set Target Tile Pos: ${this.TargetTilePos.X}, ${this.TargetTilePos.Y}`);
    }
    Update() {
        const IsReachTarget = () => {
            return Math.abs(this.Owner.Pos.X - this.TargetWorldPos.X) +
                Math.abs(this.Owner.Pos.Y - this.TargetWorldPos.Y) <= 10;
        };
        const MoveToTarget = () => {
            var DeltaX = this.TargetWorldPos.X - this.Owner.Pos.X;
            var DeltaY = this.TargetWorldPos.Y - this.Owner.Pos.Y;
            if (DeltaX != 0) {
                DeltaX = DeltaX / Math.abs(DeltaX);
            }
            if (DeltaY != 0) {
                DeltaY = DeltaY / Math.abs(DeltaY);
            }
            var DeltaSum = Math.abs(DeltaX) + Math.abs(DeltaY);
            if (DeltaSum == 0) {
                return;
            }
            DeltaX = DeltaX * this.Speed / DeltaSum;
            DeltaY = DeltaY * this.Speed / DeltaSum;
            this.Owner.ChangePos(DeltaX, DeltaY);
        };
        MoveToTarget();
        if (IsReachTarget()) {
            this.PickNextTarget();
        }
    }
}
