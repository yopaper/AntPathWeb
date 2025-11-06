import * as Ant from "./Ant.js";

class PheromoneHandle{
    Owner:Ant.Ant;

    constructor(Owner:Ant.Ant){
        this.Owner = Owner;
    }
}