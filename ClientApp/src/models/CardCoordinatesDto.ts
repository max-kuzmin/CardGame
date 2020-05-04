import { Coords } from './Coords';

export class CardCoordinatesDto implements Coords {
    public readonly x: number;

    public readonly y: number;

    public readonly id: number;
}
