import * as Ant from "./Ant.js";
import * as GameMap from "./GameMap.js";
import { PheromoneType } from "./PheromoneContainer.js";
import * as Type from "./Type.js";

export class PheromoneHandle{
    Owner:Ant.Ant;
    PathQueue:Type.Vector2[]=[];
    QueueMax:number = 50;

    constructor(Owner:Ant.Ant){
        this.Owner = Owner;
    }
    
    Init():void{
        this.Owner.Movement.OnTilePosChangedDelegate.push(this.OnMovementTilePosChanged.bind(this));
    }

    PushPos(PathPos: Type.Vector2):void{
        this.PathQueue.push(PathPos);
        if(this.PathQueue.length>this.QueueMax){
            this.PathQueue.shift();
        }
    }

    ApplyPheromone(PheromoneType:PheromoneType, MaxPheromone:number=10):void{
        var MapInstance = GameMap.GetMapInstance();
        for(var i=0;i<this.PathQueue.length; i++){
            var Pos = this.PathQueue[i];
            var Tile = MapInstance.GetTile(Pos);
            var Rate = (i+1)/this.PathQueue.length;
            if(!Tile){
                continue;
            }
            Tile.GetPheromoneContainer().SetClampPheromone(PheromoneType, MaxPheromone*Rate);
        }
    }

    OnMovementTilePosChanged(NewPos:Type.Vector2, OldPos:Type.Vector2, IsHoming:boolean):void{
        this.PushPos(OldPos);
        var MapInstance = GameMap.GetMapInstance();
        var Tile = MapInstance.GetTile(OldPos);
        if(Tile){
            Tile.GetPheromoneContainer().SetClampPheromone(PheromoneType.Explore, 1);
            Tile.GetPheromoneContainer().ChangePheromone(PheromoneType.Target, -0.1);
        }
    }
}