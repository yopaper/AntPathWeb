import { Ant } from "./Ant.js";
import { Food } from "./Food.js";
import { GetMapInstance as GetGameMapInstance } from "./GameMap.js";
import { NormalTile, Obstacle } from "./MapTile.js";
export function LogDirectionRotator(DirectionRotator) {
    var Msg = `Rotator:\n`;
    Msg += `Forward: ${DirectionRotator.Forward.X}, ${DirectionRotator.Forward.Y}\n`;
    Msg += `ForwardPos: ${DirectionRotator.ForwardPos.X}, ${DirectionRotator.ForwardPos.Y}\n`;
    Msg += `BackwardPos: ${DirectionRotator.BackwardPos.X}, ${DirectionRotator.BackwardPos.Y}\n`;
    Msg += `LeftPosPos: ${DirectionRotator.LeftPos.X}, ${DirectionRotator.LeftPos.Y}\n`;
    Msg += `RightPos: ${DirectionRotator.RightPos.X}, ${DirectionRotator.RightPos.Y}\n`;
    console.log(Msg);
}
export function CreateTestMap() {
    var MapInstance = GetGameMapInstance();
    const ObstaclePos = [
        { X: 2, Y: 1 }, { X: 3, Y: 1 }, { X: 4, Y: 1 },
        { X: 4, Y: 2 },
        { X: 2, Y: 3 }, { X: 3, Y: 3 }, { X: 4, Y: 3 },
    ];
    for (var x = 0; x <= 6; x++) {
        for (var y = 0; y <= 4; y++) {
            var Index = ObstaclePos.findIndex(Pos => Pos.X == x && Pos.Y == y);
            var Pos = { X: x, Y: y };
            if (Index < 0) {
                MapInstance.AddTile(new NormalTile(Pos));
            }
            else {
                MapInstance.AddTile(new Obstacle(Pos));
            }
        }
    }
    MapInstance.AddAnt(new Ant({ X: 0, Y: 2 }));
    MapInstance.AddFood(new Food({ X: 3, Y: 2 }));
    MapInstance.AddAnt(new Ant({ X: 3, Y: 2 }));
}
