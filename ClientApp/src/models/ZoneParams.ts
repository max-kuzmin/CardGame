import { Coords } from './Coords';
import { Size } from './Size';

export class ZoneParams implements Coords, Size {
    public readonly x: number;

    public readonly y: number;

    public readonly width: number;

    public readonly height: number;
}
