import { Coords } from './Coords';

export class GameCardDto implements Coords {
    public readonly id: number;

    public readonly x: number;

    public readonly y: number;

    public readonly rotation: number;

    public readonly isOpened: boolean;

    public readonly owner: string | undefined;

    public readonly isThrown: boolean;

    public readonly order: number;
}
