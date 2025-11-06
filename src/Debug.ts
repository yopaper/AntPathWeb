import { DirectionRotator } from "./Type";


export function LogDirectionRotator(DirectionRotator:DirectionRotator):void{
    var Msg = `Rotator:\n`;
    Msg += `Forward: ${DirectionRotator.Forward.X}, ${DirectionRotator.Forward.Y}\n`;
    Msg += `ForwardPos: ${DirectionRotator.ForwardPos.X}, ${DirectionRotator.ForwardPos.Y}\n`;
    Msg += `BackwardPos: ${DirectionRotator.BackwardPos.X}, ${DirectionRotator.BackwardPos.Y}\n`;
    Msg += `LeftPosPos: ${DirectionRotator.LeftPos.X}, ${DirectionRotator.LeftPos.Y}\n`;
    Msg += `RightPos: ${DirectionRotator.RightPos.X}, ${DirectionRotator.RightPos.Y}\n`;
    console.log(Msg);
}