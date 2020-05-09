import { Coords } from './Coords';
import { ZoneParams } from './ZoneParams';

export class PlayerDto {
    public readonly label: Coords;

    public readonly personalZone: ZoneParams;

    public readonly name: string;
}
