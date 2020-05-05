import { Coords } from './Coords';

export class PlayerLabelCoordinatesDto implements Coords {
    public readonly x: number;

    public readonly y: number;

    public readonly name: string;
}
