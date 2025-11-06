import * as Canvas from "./Canvas.js";
import * as GameMap from "./GameMap.js";
import * as Type from "./Type.js";
import { NormalTile, Obstacle } from "./MapTile.js";
import { Ant } from "./Ant.js";
Canvas.Init();
GameMap.Init();
for (var x = 0; x <= 15; x++) {
    for (var y = 0; y <= 15; y++) {
        if (x == 0 && y == 0) {
            GameMap.GetInstance().AddTile(new NormalTile({ X: x, Y: y }));
        }
        else if (Math.random() > 0.7) {
            GameMap.GetInstance().AddTile(new Obstacle({ X: x, Y: y }));
        }
        else {
            GameMap.GetInstance().AddTile(new NormalTile({ X: x, Y: y }));
        }
    }
}
GameMap.GetInstance().AddAnt(new Ant({ X: 10, Y: 10 }));
function Update() {
    Canvas.ClearCanvas();
    GameMap.GetInstance().Update();
    GameMap.GetInstance().Draw();
}
setInterval(Update, Type.DeltaTime);
