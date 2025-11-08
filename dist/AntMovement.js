import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as GameMap from "./GameMap.js";
import { PheromoneType } from "./PheromoneContainer.js";
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
        const MapInstance = GameMap.GetMapInstance();
        const Rotator = Type.GetDirectionRotator(this.Direction, this.TargetTilePos);
        const GetMaxPheromonePos = (PheromonePositions) => {
            var MaxPhenomenonPos = null;
            var MaxPhenomenonValue = null;
            PheromonePositions.forEach(([Position, Pheromone]) => {
                if (!Pheromone) {
                    return;
                }
                if (MaxPhenomenonValue == null || MaxPhenomenonValue < Pheromone) {
                    MaxPhenomenonValue = Pheromone;
                    MaxPhenomenonPos = Position;
                }
            });
            return MaxPhenomenonPos;
        };
        const TryToFindFood = () => {
            return TryToFindMapObject((Pos) => {
                var MapInstance = GameMap.GetMapInstance();
                return MapInstance.FindFood(Pos) != null;
            });
        };
        const TryToFindAntNest = () => {
            return TryToFindMapObject((Pos) => {
                var MapInstance = GameMap.GetMapInstance();
                return MapInstance.FindAntNest(Pos) != null;
            });
        };
        const TryToFindMapObject = (ObjectChecker) => {
            var AdjacentPos = Type.GetAdjacentPos(this.TargetTilePos);
            var OutPos = null;
            AdjacentPos.Positions.forEach((Pos) => {
                if (ObjectChecker(Pos)) {
                    OutPos = Pos;
                }
            });
            return OutPos;
        };
        const TryToFindTargetPheromone = () => {
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, PheromoneType.Target);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, PheromoneType.Target);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, PheromoneType.Target);
            var Position = GetMaxPheromonePos([
                [Rotator.ForwardPos, ForwardPheromone],
                [Rotator.RightPos, RightPheromone],
                [Rotator.LeftPos, LeftPheromone],
            ]);
            return Position;
        };
        const TryToFindHomingPheromone = () => {
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, PheromoneType.Homing);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, PheromoneType.Homing);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, PheromoneType.Homing);
            var Position = GetMaxPheromonePos([
                [Rotator.ForwardPos, ForwardPheromone],
                [Rotator.RightPos, RightPheromone],
                [Rotator.LeftPos, LeftPheromone],
            ]);
            return Position;
        };
        const TryToFindExplorePheromone = () => {
            console.log("TryToFindExplorePheromone");
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, PheromoneType.Explore);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, PheromoneType.Explore);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, PheromoneType.Explore);
            if (!ForwardPheromone && !RightPheromone && !LeftPheromone) {
                return [false, { X: 0, Y: 0 }];
            }
            if (ForwardPheromone == 0) {
                console.log("Forward is 0");
                return [true, Rotator.ForwardPos];
            }
            if (RightPheromone == 0 && LeftPheromone == 0) {
                console.log("Right Left are 0");
                if (Math.random() < 0.5) {
                    return [true, Rotator.RightPos];
                }
                else {
                    return [true, Rotator.LeftPos];
                }
            }
            if (RightPheromone == 0) {
                return [true, Rotator.RightPos];
            }
            if (LeftPheromone == 0) {
                return [true, Rotator.LeftPos];
            }
            var MinPheromone = null;
            var MinPos = null;
            if (ForwardPheromone) {
                MinPheromone = ForwardPheromone;
                MinPos = Rotator.ForwardPos;
            }
            if (RightPheromone && (!MinPheromone || RightPheromone < MinPheromone)) {
                MinPheromone = RightPheromone;
                MinPos = Rotator.RightPos;
            }
            if (LeftPheromone && (!MinPheromone || LeftPheromone < MinPheromone)) {
                MinPheromone = LeftPheromone;
                MinPos = Rotator.LeftPos;
            }
            if (MinPos) {
                return [true, MinPos];
            }
            return [false, { X: 0, Y: 0 }];
        };
        const TryToFindWithoutPheromone = () => {
            if (MapInstance.IsPassable(Rotator.ForwardPos) && Math.random() < 0.8) {
                return [true, Rotator.ForwardPos];
            }
            if (MapInstance.IsPassable(Rotator.LeftPos) && MapInstance.IsPassable(Rotator.RightPos)) {
                if (Math.random() > 0.5) {
                    return [true, Rotator.RightPos];
                }
                else {
                    return [true, Rotator.LeftPos];
                }
            }
            else if (MapInstance.IsPassable(Rotator.LeftPos)) {
                return [true, Rotator.LeftPos];
            }
            else if (MapInstance.IsPassable(Rotator.RightPos)) {
                return [true, Rotator.RightPos];
            }
            else if (MapInstance.IsPassable(Rotator.BackwardPos)) {
                return [true, Rotator.BackwardPos];
            }
            return [false, { X: 0, Y: 0 }];
        };
        var MainTargetPos = null;
        if (this.IsHoming) {
            MainTargetPos = TryToFindAntNest();
        }
        else {
            MainTargetPos = TryToFindFood();
        }
        if (MainTargetPos) {
            this.SetTilePos(MainTargetPos);
            return;
        }
        if (Math.random() < 0.9) {
            var PheromonePos = null;
            if (this.IsHoming) {
                PheromonePos = TryToFindHomingPheromone();
            }
            else {
                PheromonePos = TryToFindTargetPheromone();
            }
            if (PheromonePos) {
                this.SetTilePos(PheromonePos);
                return;
            }
        }
        if (!this.IsHoming) {
            var [ExploreResult, OutPos] = TryToFindExplorePheromone();
            if (ExploreResult) {
                this.SetTilePos(OutPos);
                return;
            }
        }
        var [PathResult, OutPos] = TryToFindWithoutPheromone();
        if (PathResult) {
            this.SetTilePos(OutPos);
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
                Math.abs(this.Owner.Pos.Y - this.TargetWorldPos.Y) <= 5;
        };
        const IsReachFood = () => {
            var OwnerPos = this.Owner.GetTilePos();
            var MapInstance = GameMap.GetMapInstance();
            return MapInstance.FindFood(OwnerPos);
        };
        const IsReachNest = () => {
            var OwnerPos = this.Owner.GetTilePos();
            var MapInstance = GameMap.GetMapInstance();
            return MapInstance.FindAntNest(OwnerPos) != null;
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
            if (!this.IsHoming) {
                var Food = IsReachFood();
                if (Food) {
                    this.Owner.PheromoneHandle.ApplyPheromone(PheromoneType.Target);
                    Food.BeEated();
                    this.IsHoming = true;
                }
            }
            else {
                if (IsReachNest()) {
                    var MapInstance = GameMap.GetMapInstance();
                    this.Owner.PheromoneHandle.ApplyPheromone(PheromoneType.Homing, 25);
                    MapInstance.RemoveAnt(this.Owner);
                }
            }
            this.PickNextTarget();
        }
    }
}
