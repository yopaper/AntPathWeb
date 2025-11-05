import * as Canvas from "./Canvas.js";
import * as GameMap from "./GameMap.js";
import * as Type from "./Type.js";
import { NormalTile } from "./MapTile.js";

Canvas.Init();
GameMap.Init();

for(var x=0; x<=5 ;x+=2){
    GameMap.GetInstance().AddTile({X:x, Y:1}, new NormalTile());
}

function Update():void{
    GameMap.GetInstance().Draw();
}

setInterval(Update, Type.DeltaTime);