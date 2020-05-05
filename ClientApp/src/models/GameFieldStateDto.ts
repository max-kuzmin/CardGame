import { GameCardDto } from './GameCardDto';
import { PlayerLabelDto } from './PlayerLabelDto';

export class GameFieldStateDto {
    public readonly cards: GameCardDto[];

    public readonly playerLabels: PlayerLabelDto[];
}
