import * as Canvas from "./Canvas.js";
import * as GameMap from "./GameMap.js";
import * as Type from "./Type.js";
import { NormalTile, Obstacle } from "./MapTile.js";
import { Ant } from "./Ant.js";
import { Food } from "./Food.js";
import { AntNest } from "./AntNest.js";
Canvas.Init();
GameMap.Init();
const MapSize = { X: 99, Y: 99 };
const MapCenter = { X: Math.floor(MapSize.X / 2), Y: Math.floor(MapSize.Y / 2) };
for (var x = 0; x <= MapSize.X; x++) {
    for (var y = 0; y <= MapSize.Y; y++) {
        var DeltaToCenter = { X: Math.abs(x - MapCenter.X), Y: Math.abs(y - MapCenter.Y) };
        DeltaToCenter.X = DeltaToCenter.X * DeltaToCenter.X;
        DeltaToCenter.Y = DeltaToCenter.Y * DeltaToCenter.Y;
        var SquardDistance = DeltaToCenter.X + DeltaToCenter.Y;
        if (SquardDistance <= 100) {
            GameMap.GetMapInstance().AddTile(new NormalTile({ X: x, Y: y }));
            continue;
        }
        if (SquardDistance <= 200 && Math.random() > 0.75) {
            GameMap.GetMapInstance().AddTile(new Obstacle({ X: x, Y: y }));
            continue;
        }
        if (SquardDistance >= 400 && SquardDistance <= 550 && Math.random() > 0.75) {
            GameMap.GetMapInstance().AddTile(new Obstacle({ X: x, Y: y }));
            continue;
        }
        else {
            GameMap.GetMapInstance().AddTile(new NormalTile({ X: x, Y: y }));
        }
    }
}
GameMap.GetMapInstance().AddAntNest(new AntNest(MapCenter));
function Update() {
    const SpawnFood = () => {
        var FoodNumber = GameMap.GetMapInstance().Foods.length;
        var Rate = 1 / (FoodNumber * 10 + 1);
        if (FoodNumber <= 0) {
            Rate = 2;
        }
        if (Math.random() >= 1 / FoodNumber) {
            return;
        }
        var RandomPos = { X: Math.round(Math.random() * MapSize.X), Y: Math.round(Math.random() * MapSize.Y) };
        if (!GameMap.GetMapInstance().IsPassable(RandomPos)) {
            return;
        }
        GameMap.GetMapInstance().AddFood(new Food(RandomPos));
    };
    const SpawnAnt = () => {
        var AntNumber = GameMap.GetMapInstance().Ants.length;
        var Rate = 1 / (AntNumber + 1);
        if (AntNumber < 50) {
            Rate = 2;
        }
        if (Math.random() >= Rate) {
            return;
        }
        var RandomPos = { X: Math.round(Math.random() * MapSize.X), Y: Math.round(Math.random() * MapSize.Y) };
        if (!GameMap.GetMapInstance().IsPassable(RandomPos)) {
            return;
        }
        GameMap.GetMapInstance().AddAnt(new Ant(RandomPos));
    };
    SpawnFood();
    Canvas.ClearCanvas();
    GameMap.GetMapInstance().Update();
    GameMap.GetMapInstance().Draw();
}
setInterval(Update, Type.DeltaTime);
