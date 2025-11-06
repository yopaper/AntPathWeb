import * as Ant from "./Ant.js";
import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as GameMap from "./GameMap.js";
import * as Debug from "./Debug.js";

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
            var ForwardPheromone = MapInstance.GetPheromone(Rotator.ForwardPos, this.IsHoming);
            var RightPheromone = MapInstance.GetPheromone(Rotator.RightPos, this.IsHoming);
            var LeftPheromone = MapInstance.GetPheromone(Rotator.LeftPos, this.IsHoming);
            if(ForwardPheromone>0){
                return [true, Rotator.ForwardPos];
            }
            if(RightPheromone>0 && LeftPheromone>0){
                if(RightPheromone > LeftPheromone){
                    return [true, Rotator.RightPos];
                }else{
                    return [true, Rotator.LeftPos];
                }
            }else if(RightPheromone>0){
                return [true, Rotator.RightPos];
            }else if(LeftPheromone>0){
                return [true, Rotator.LeftPos];
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

        const IsReachFood = ():boolean=>{
            var OwnerPos = this.Owner.GetTilePos();
            var MapInstance = GameMap.GetInstance();
            return MapInstance.FindFood(OwnerPos)!=null;
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
            if(IsReachFood()){
                this.Owner.PheromoneHandle.ApplyPheromone(this.IsHoming);
                GameMap.GetInstance().RemoveAnt(this.Owner);
            }
            this.PickNextTarget();
        }
    }
}