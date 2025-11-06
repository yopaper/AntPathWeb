export const FPS = 20;
export const DeltaTime = 1000 / FPS;
export const WhiteColor = "#DDD";
export const GrayColor = "#777";
export const BlackColor = "#111";
export function GetPheromoneColor(TargetPheromone, HomingPheromone) {
    var TargetRate = 1 - TargetPheromone * (TargetPheromone + 50);
    var HomingRate = 1 - HomingPheromone * (HomingPheromone + 50);
    var R = ~~(255 * TargetRate);
    var G = ~~(255 * HomingRate);
    var B = G;
    return `rgb(${R}, ${G}, ${B})`;
}
