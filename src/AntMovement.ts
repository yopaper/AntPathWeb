import * as Ant from "./Ant.js";
import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as GameMap from "./GameMap.js";
import * as Debug from "./Debug.js";
import { PheromoneType } from "./PheromoneContainer.js";
import { Food } from "./Food.js";

type OnMovementTilePosChanged = (NewPos:Type.Vector2, OldPos:Type.Vector2, IsHoming:boolean)=>void;
type PositionFindingResult = [boolean, Type.Vector2];

export class AntMovement{
    Owner:Ant.Ant;
    TargetTilePos:Type.Vector2={X:0, Y:0};
    TargetWorldPos:Type.Vector2={X:0, Y:0};
    Direction:Type.Vector2;
    IsHoming:boolean=false;
    OnTilePosChangedDelegate:OnMovementTilePosChanged[] = [];
    Speed:number = 5;

    constructor(Owner:Ant.Ant){
        this.Owner = Owner;
        this.TargetTilePos = Owner.GetTilePos();
        this.TargetWorldPos = MapTile.GetTileCenter(Owner.GetTilePos());
        this.Direction = Type.GetRandomDirection();
        console.log(`Direction: ${this.Direction.X}, ${this.Direction.Y}`);
    }

    PickNextTarget():void{
        console.log("PickNextTarget");

        const MapInstance = GameMap.GetInstance();
        const Rotator = Type.GetDirectionRotator(this.Direction, this.TargetTilePos);

        const TryToFindFood = ():PositionFindingResult=>{
            var AdjacentPos = Type.GetAdjacentPos(this.TargetTilePos);
            var OutPos:Type.Vector2|null = null;
            AdjacentPos.Positions.forEach((Pos)=>{
                if(MapInstance.FindFood(Pos)!=null){
                    OutPos = Pos;
                }
            });
            if(OutPos){
                return [true, OutPos];
            }
            return [false, {X:0, Y:0}];
        };

        const TryToFindPheromone = ():PositionFindingResult=>{
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, PheromoneType.Target);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, PheromoneType.Target);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, PheromoneType.Target);
            if(ForwardPheromone){
                return [true, Rotator.ForwardPos];
            }
            if(RightPheromone && LeftPheromone){
                if(RightPheromone > LeftPheromone){
                    return [true, Rotator.RightPos];
                }else{
                    return [true, Rotator.LeftPos];
                }
            }else if(RightPheromone){
                return [true, Rotator.RightPos];
            }else if(LeftPheromone){
                return [true, Rotator.LeftPos];
            }
            return [false, {X:0, Y:0}];
        };

        const TryToFindExplorePheromone = ():PositionFindingResult=>{
            console.log("TryToFindExplorePheromone");
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, PheromoneType.Explore);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, PheromoneType.Explore);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, PheromoneType.Explore);
            if(!ForwardPheromone && !RightPheromone && !LeftPheromone){
                return [false, {X:0, Y:0}];
            }

            if(ForwardPheromone==0){
                console.log("Forward is 0");
                return [true, Rotator.ForwardPos];
            }
            if(RightPheromone==0 && LeftPheromone==0){
                console.log("Right Left are 0");
                if(Math.random()<0.5){
                    return[true, Rotator.RightPos];
                }
                else{
                    return[true, Rotator.LeftPos];
                }
            }
            if(RightPheromone==0){
                return[true, Rotator.RightPos];
            }
            if(LeftPheromone==0){
                return[true, Rotator.LeftPos];
            }
            // 以上排除都為0的情況
            var MinPheromone:number|null = null;
            var MinPos:Type.Vector2|null = null;
            if(ForwardPheromone){
                MinPheromone = ForwardPheromone;
                MinPos = Rotator.ForwardPos;
            }
            if(RightPheromone && (!MinPheromone || RightPheromone<MinPheromone)){
                MinPheromone = RightPheromone;
                MinPos = Rotator.RightPos;
            }
            if(LeftPheromone && (!MinPheromone || LeftPheromone<MinPheromone)){
                MinPheromone = LeftPheromone;
                MinPos = Rotator.LeftPos;
            }
            if(MinPos){
                return [true, MinPos];
            }
            return [false, {X:0, Y:0}];
        };

        const TryToFindWithoutPheromone = ():PositionFindingResult=>{
            if(MapInstance.IsPassable(Rotator.ForwardPos)&&Math.random()<0.8){
                return [true, Rotator.ForwardPos];
            }
            if(MapInstance.IsPassable(Rotator.LeftPos)&&MapInstance.IsPassable(Rotator.RightPos)){
                if(Math.random()>0.5){
                    return [true, Rotator.RightPos];
                }else{
                    return [true, Rotator.LeftPos];
                }
            }
            else if(MapInstance.IsPassable(Rotator.LeftPos)){
                return [true, Rotator.LeftPos];
            }
            else if(MapInstance.IsPassable(Rotator.RightPos)){
                return [true, Rotator.RightPos];
            }
            else if(MapInstance.IsPassable(Rotator.BackwardPos)){
                return [true, Rotator.BackwardPos];
            }
            return [false, {X:0, Y:0}];
        };

        var [FoodResult, OutPos] = TryToFindFood();
        if(FoodResult){
            this.SetTilePos(OutPos);
            return;
        }

        if(Math.random()<0.95){
            var [PheromoneResult, OutPos] = TryToFindPheromone();
            if(PheromoneResult){
                this.SetTilePos(OutPos);
                return;
            }
        }

        var [ExploreResult, OutPos] = TryToFindExplorePheromone();
        if(ExploreResult){
            this.SetTilePos(OutPos);
            return;
        }

        var [PathResult, OutPos] = TryToFindWithoutPheromone();
        if(PathResult){
            this.SetTilePos(OutPos);
        }
    }

    SetTilePos(TilePos:Type.Vector2):void{
        if(this.TargetTilePos.X==TilePos.X && this.TargetTilePos.Y==TilePos.Y){
            return;
        }
        if( Math.abs(TilePos.X - this.TargetTilePos.X) + Math.abs(TilePos.Y - this.TargetTilePos.Y)>1 ){
            return;
        }
        this.OnTilePosChangedDelegate.forEach((Delegate)=>{
            Delegate(TilePos, this.TargetTilePos, this.IsHoming);
        });
        
        this.Direction = {X: TilePos.X - this.TargetTilePos.X, Y: TilePos.Y - this.TargetTilePos.Y};
        this.TargetTilePos = TilePos;
        this.TargetWorldPos = MapTile.GetTileCenter(TilePos);
        console.log(`Set Target Tile Pos: ${this.TargetTilePos.X}, ${this.TargetTilePos.Y}`);
    }

    Update():void{
        const IsReachTarget = ():boolean=>{
            return Math.abs(this.Owner.Pos.X - this.TargetWorldPos.X)+
            Math.abs(this.Owner.Pos.Y - this.TargetWorldPos.Y)<=10;
        };

        const IsReachFood = ():Food|null=>{
            var OwnerPos = this.Owner.GetTilePos();
            var MapInstance = GameMap.GetInstance();
            return MapInstance.FindFood(OwnerPos);
        };

        const MoveToTarget = ():void=>{
            var DeltaX = this.TargetWorldPos.X - this.Owner.Pos.X;
            var DeltaY = this.TargetWorldPos.Y - this.Owner.Pos.Y;
            if(DeltaX!=0){
                DeltaX = DeltaX / Math.abs(DeltaX);
            }
            if(DeltaY!=0){
                DeltaY = DeltaY / Math.abs(DeltaY);
            }
            var DeltaSum = Math.abs(DeltaX) + Math.abs(DeltaY);
            if(DeltaSum==0){
                return;
            }
            DeltaX = DeltaX * this.Speed / DeltaSum;
            DeltaY = DeltaY * this.Speed / DeltaSum;
            this.Owner.ChangePos(DeltaX, DeltaY);
        };

        MoveToTarget();
        if(IsReachTarget()){
            var Food = IsReachFood();
            if(Food){
                this.Owner.PheromoneHandle.ApplyPheromone(PheromoneType.Target);
                var MapInstance = GameMap.GetInstance();
                MapInstance.RemoveAnt(this.Owner);
                Food.BeEated();
            }
            this.PickNextTarget();
        }
    }
}