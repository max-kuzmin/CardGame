import { GameCardDto } from './GameCardDto';
import { PlayerLabelDto } from './PlayerLabelDto';

export class GameFieldStateDto {
    public cards: GameCardDto[];

    public playerLabels: PlayerLabelDto[];
}
