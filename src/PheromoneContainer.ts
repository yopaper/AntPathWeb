
export enum PheromoneType{
    Target = 0,
    Explore = 1,
    Homing = 2,
}

export class PheromoneContainer{
    PheromoneTable = new Map<PheromoneType, number>();

    GetPheromone(PheromoneType:PheromoneType):number{
        var Value = this.PheromoneTable.get(PheromoneType);
        if(!Value){
            return 0;
        }
        return Value;
    }

    SetClampPheromone(PheromoneType:PheromoneType, Value:number):void{
        var OriginalValue = this.GetPheromone(PheromoneType);
        this.SetPheromone(PheromoneType, Math.max(OriginalValue, Value));
    }

    SetPheromone(PheromoneType:PheromoneType, Value:number):void{
        Value = Math.max(Value, 0);
        this.PheromoneTable.set(PheromoneType, Value);
    }

    ChangePheromone(PheromoneType:PheromoneType, Delta:number):void{
        this.SetPheromone( PheromoneType, this.GetPheromone(PheromoneType)+Delta );
    }
}