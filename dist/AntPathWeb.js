import * as Canvas from "./Canvas.js";
import * as GameMap from "./GameMap.js";
import * as Type from "./Type.js";
import { NormalTile, Obstacle } from "./MapTile.js";
import { Ant } from "./Ant.js";
import { Food } from "./Food.js";
Canvas.Init();
GameMap.Init();
const MapSize = { X: 25, Y: 25 };
for (var x = 0; x <= MapSize.X; x++) {
    for (var y = 0; y <= MapSize.Y; y++) {
        if ((x == 0 && y == 0) || (x == MapSize.X && y == MapSize.Y)) {
            GameMap.GetInstance().AddTile(new NormalTile({ X: x, Y: y }));
        }
        else if (Math.random() > 0.8) {
            GameMap.GetInstance().AddTile(new Obstacle({ X: x, Y: y }));
        }
        else {
            GameMap.GetInstance().AddTile(new NormalTile({ X: x, Y: y }));
        }
    }
}
for (var i = 0; i < 30; i++) {
    GameMap.GetInstance().AddAnt(new Ant({ X: 0, Y: 0 }));
}
GameMap.GetInstance().AddFood(new Food(MapSize));
function Update() {
    if (Math.random() < 0.05) {
        GameMap.GetInstance().AddAnt(new Ant({ X: 0, Y: 0 }));
    }
    Canvas.ClearCanvas();
    GameMap.GetInstance().Update();
    GameMap.GetInstance().Draw();
}
setInterval(Update, Type.DeltaTime);
