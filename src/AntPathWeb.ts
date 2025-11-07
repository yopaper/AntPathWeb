import * as Canvas from "./Canvas.js";
import * as GameMap from "./GameMap.js";
import * as Type from "./Type.js";
import { NormalTile, Obstacle } from "./MapTile.js";
import { Ant } from "./Ant.js";
import { Food } from "./Food.js";

Canvas.Init();
GameMap.Init();

const MapSize:Type.Vector2={X:79, Y:79};

for(var x=0; x<=MapSize.X ;x++){
    for(var y=0; y<=MapSize.Y; y++){
        if((x==0 && y==0)||(x==MapSize.X && y==MapSize.Y)){
            GameMap.GetInstance().AddTile(new NormalTile( {X:x, Y:y} ));
        }
        else if(Math.random()>0.825){
            GameMap.GetInstance().AddTile(new Obstacle( {X:x, Y:y} ));
        }
        else{
            GameMap.GetInstance().AddTile(new NormalTile( {X:x, Y:y} ));
        }
    }
}

GameMap.GetInstance().AddFood( new Food(MapSize) );

function Update():void{
    const SpawnFood = ():void=>{
        var FoodNumber = GameMap.GetInstance().Foods.length*15 + 1;
        if( Math.random()>=1/FoodNumber ){
            return;
        }
        var RandomPos:Type.Vector2 = {X: Math.round(Math.random()*MapSize.X), Y: Math.round(Math.random()*MapSize.Y)};
        if(!GameMap.GetInstance().IsPassable(RandomPos)){
            return;
        }
        GameMap.GetInstance().AddFood(new Food(RandomPos));
    };
    const SpawnAnt = ():void=>{
        var AntNumber = GameMap.GetInstance().Ants.length;
        var Rate = 1/(AntNumber + 1);
        if(AntNumber<50){
            Rate = 2;
        }
        if( Math.random()>=Rate ){
            return;
        }
        var RandomPos:Type.Vector2 = {X: Math.round(Math.random()*MapSize.X), Y: Math.round(Math.random()*MapSize.Y)};
        if(!GameMap.GetInstance().IsPassable(RandomPos)){
            return;
        }
        GameMap.GetInstance().AddAnt(new Ant(RandomPos));
    };
    SpawnFood();
    SpawnAnt();
    Canvas.ClearCanvas();
    GameMap.GetInstance().Update();
    GameMap.GetInstance().Draw();
}

setInterval(Update, Type.DeltaTime);