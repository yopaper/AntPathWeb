
export enum PheromoneType{
    Target = 0,
    Explore = 1,
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

    SetPheromone(PheromoneType:PheromoneType, Value:number):void{
        Value = Math.max(Value, 0);
        this.PheromoneTable.set(PheromoneType, Value);
    }

    ChangePheromone(PheromoneType:PheromoneType, Delta:number):void{
        this.SetPheromone( PheromoneType, this.GetPheromone(PheromoneType)+Delta );
    }
}