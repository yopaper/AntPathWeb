import * as Ant from "./Ant.js";
import * as Type from "./Type.js";
import * as MapTile from "./MapTile.js";
import * as GameMap from "./GameMap.js";

type OnMovementTilePosChanged = (NewPos:Type.Vector2, OldPos:Type.Vector2, IsHoming:boolean)=>void;

export class AntMovement{
    Owner:Ant.Ant;
    TargetTilePos:Type.Vector2={X:0, Y:0};
    TargetWorldPos:Type.Vector2={X:0, Y:0};
    Direction:Type.Vector2;
    IsHoming:boolean=false;
    OnTilePosChangedDelegate:OnMovementTilePosChanged[] = [];

    constructor(Owner:Ant.Ant){
        this.Owner = Owner;
        this.TargetTilePos = Owner.GetTilePos();
        this.TargetWorldPos = Owner.Pos;
        this.Direction = Type.GetRandomDirection();
    }

    PickNextTarget():void{
        const PickWithoutPheromone = ():Type.Vector2=>{
            var Rotator = Type.GetDirectionRotator(this.Direction, this.TargetTilePos);
            var MapInstance = GameMap.GetInstance();

            if(Math.random()<0.666 && MapInstance.IsPassable(Rotator.ForwardPos)){
                return Rotator.ForwardPos;
            }
            const TurnRandom = Math.random();
            if(TurnRandom<0.5 && MapInstance.IsPassable(Rotator.RightPos)){
                return Rotator.RightPos;
            }else if(MapInstance.IsPassable(Rotator.BackwardPos)){
                return Rotator.LeftPos;
            }
            if(MapInstance.IsPassable(Rotator.BackwardPos)){
                return Rotator.BackwardPos;
            }
            return this.TargetTilePos;
        };

        const PickPheromone = (PheromoneGetter:(MapTile:MapTile.MapTile)=>number):Type.Vector2=>{
            const AdjacentPos = Type.GetAdjacentPos(this.TargetTilePos);
            var PheromoneSum = 0;
            var PheromoneList:number[] = [];

            // 走訪周邊 Tile 取得 Pheromone
            AdjacentPos.Positions.forEach((Pos)=>{
                var MapInstance = GameMap.GetInstance();
                if(!MapInstance.IsPassable(Pos)){
                    return;
                }
                var Tile = MapInstance.GetTile(Pos);
                if(!Tile){
                    return;
                }
                var Pheromone = PheromoneGetter(Tile);
                PheromoneList.push(Pheromone+PheromoneSum);
                PheromoneSum += Pheromone;
            });

            if(PheromoneSum<=0){
                return PickWithoutPheromone();
            }

            // 根據 Pheromone 權重取得目標座標
            var Random = Math.random() * PheromoneSum;
            var OutTilePos:Type.Vector2 = {X:0, Y:0};
            PheromoneList.forEach((Pheromone, Index)=>{
                if(Random>Pheromone){
                    return;
                }
                OutTilePos = AdjacentPos.Positions[Index];
            });
            return OutTilePos;
        };

        const PickTargetPheromone = ():Type.Vector2=>{
            return PickPheromone((Tile)=>{
                return Tile.GetTargetPheromone();
            });
        };

        const PickHomingPheromone = ():Type.Vector2=>{
        return PickPheromone((Tile)=>{
                return Tile.GetHomingPheromone();
            });
        };

        var NextTilePos:Type.Vector2;
        if(this.IsHoming){
            NextTilePos = PickHomingPheromone();
        }else{
            NextTilePos = PickTargetPheromone();
        }
    }
}