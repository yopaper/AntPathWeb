import * as PheromoneContainerPack from "./PheromoneContainer.js";

export interface Vector2{
    X:number;
    Y:number;
}

export interface AdjacentPos{
    Right:Vector2;
    Left:Vector2;
    Up:Vector2;
    Down:Vector2;
    Positions:Vector2[];
}

export interface DirectionRotator{
    Forward:Vector2;
    Backward:Vector2;
    TurnRight:Vector2;
    TurnLeft:Vector2;

    ForwardPos:Vector2;
    BackwardPos:Vector2;
    RightPos:Vector2;
    LeftPos:Vector2;
}

export const FPS = 20;
export const DeltaTime = 1000/FPS;

export const WhiteColor = "#DDD";
export const GrayColor = "#777";
export const BlackColor = "#111";

export const Right = {X:1, Y:0};
export const Left = {X:-1, Y:0};
export const Up = {X:0, Y:1};
export const Down = {X:0, Y:-1};

export function Vector2ToKey(Vector2:Vector2):string{
    return `${Vector2.X},${Vector2.Y}`;
}

export function GetPheromoneColor(PheromoneContainer:PheromoneContainerPack.PheromoneContainer):string{
    const RateBase = 25;
    var TargetPheromone = PheromoneContainer.GetPheromone(PheromoneContainerPack.PheromoneType.Target);
    var ExplorePheromone = PheromoneContainer.GetPheromone(PheromoneContainerPack.PheromoneType.Explore);
    var HomingPheromone = PheromoneContainer.GetPheromone(PheromoneContainerPack.PheromoneType.Homing);
    var TargetRate = 1 - TargetPheromone / (TargetPheromone+RateBase);
    var ExploreRate = 1 - ExplorePheromone / (ExplorePheromone+RateBase);
    var HomingRate = 1 - HomingPheromone / (HomingPheromone+RateBase);
    var R = Math.floor(255 * TargetRate);
    var G = Math.floor(255 * ExploreRate);
    var B = Math.floor(255 * HomingRate);
    return `rgb(${R}, ${G}, ${B})`;
}

export function GetAdjacentPos(Pos:Vector2):AdjacentPos{
    const Right:Vector2 = {X:Pos.X+1, Y:Pos.Y};
    const Left:Vector2 = {X:Pos.X-1, Y:Pos.Y};
    const Up:Vector2 = {X:Pos.X, Y:Pos.Y+1};
    const Down:Vector2 = {X:Pos.X, Y:Pos.Y-1};
    return {Right:Right, Left:Left, Up:Up, Down:Down, Positions:[Right, Left, Up, Down]};
}

export function GetRandomDirection():Vector2{
    var Random = ~~(Math.random()*4);
    if(Random==0){
        return Right;
    }
    else if(Random==1){
        return Left;
    }
    else if(Random==2){
        return Up;
    }
    else if(Random==3){
        return Down;
    }
    throw new Error(`Random Fail: ${Random}`);
}

export function GetDirectionRotator(Direction:Vector2, Pos:Vector2):DirectionRotator{
    const Backward =    {X:-Direction.X, Y:-Direction.Y};
    const TurnRight =   {X:Direction.Y, Y:Direction.X};
    const TurnLeft =    {X:-Direction.Y, Y:-Direction.X};
    return{
        Forward: Direction, Backward: Backward,
        TurnRight: TurnRight, TurnLeft: TurnLeft,
        ForwardPos: {X: Pos.X + Direction.X, Y: Pos.Y + Direction.Y},
        BackwardPos: {X: Pos.X + Backward.X, Y: Pos.Y + Backward.Y},
        RightPos:   {X: Pos.X + TurnRight.X, Y: Pos.Y + TurnRight.Y},
        LeftPos:    {X: Pos.X + TurnLeft.X, Y: Pos.Y + TurnLeft.Y}
    };
};