import { Coords } from './Coords';
import { Size } from './Size';

export class PersonalZoneParamsDto implements Coords, Size {
    public readonly width: number;

    public readonly height: number;

    public readonly x: number;

    public readonly y: number;

    public readonly name: string;
}
