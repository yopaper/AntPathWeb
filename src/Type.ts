
export interface Vector2{
    X:number;
    Y:number;
}

export const FPS = 20;
export const DeltaTime = 1000/FPS;
export const WhiteColor = "#DDD";
export const GrayColor = "#777";
export const BlackColor = "#111";

export function GetPheromoneColor(Pheromone:number):string{
    var R = ~~(255 * Pheromone * (Pheromone+50));
    var G = 255 - R;
    var B = G;
    return `rgb(${R}, ${G}, ${B})`;
}