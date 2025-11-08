export var PheromoneType;
(function (PheromoneType) {
    PheromoneType[PheromoneType["Target"] = 0] = "Target";
    PheromoneType[PheromoneType["Explore"] = 1] = "Explore";
    PheromoneType[PheromoneType["Homing"] = 2] = "Homing";
})(PheromoneType || (PheromoneType = {}));
export class PheromoneContainer {
    constructor() {
        this.PheromoneTable = new Map();
    }
    GetPheromone(PheromoneType) {
        var Value = this.PheromoneTable.get(PheromoneType);
        if (!Value) {
            return 0;
        }
        return Value;
    }
    SetClampPheromone(PheromoneType, Value) {
        var OriginalValue = this.GetPheromone(PheromoneType);
        this.SetPheromone(PheromoneType, Math.max(OriginalValue, Value));
    }
    SetPheromone(PheromoneType, Value) {
        Value = Math.max(Value, 0);
        this.PheromoneTable.set(PheromoneType, Value);
    }
    ChangePheromone(PheromoneType, Delta) {
        this.SetPheromone(PheromoneType, this.GetPheromone(PheromoneType) + Delta);
    }
}
