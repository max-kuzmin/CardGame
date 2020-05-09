import { GameCardDto } from './GameCardDto';
import { PlayerDto } from './PlayerDto';

export class GameFieldStateDto {
    public readonly cards: GameCardDto[];

    public readonly players: PlayerDto[];
}
