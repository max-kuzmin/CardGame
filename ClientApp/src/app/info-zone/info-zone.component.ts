import { Component, Input } from '@angular/core';
import { PlayerInfo } from 'src/models/PlayerInfo';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { Coords } from 'src/models/Coords';
import { InfoZoneParams } from 'src/models/Constants';

@Component({
  selector: 'app-info-zone',
  templateUrl: './info-zone.component.html',
  styleUrls: ['./info-zone.component.css']
})
export class InfoZoneComponent {
  players: PlayerInfo[];
  model: Coords = InfoZoneParams;

  @Input() set state(value: GameFieldStateDto) {
    const result: PlayerInfo[] = [];
    const ownedCards = value.cards.filter(e => e.owner);

    for (const card of ownedCards) {
      const existPlayerIndex = result.findIndex(e => e.name === card.owner);
      if (existPlayerIndex === -1) {
        result.push({ name: card.owner, cardsCount: 1 });
      } else {
        result[existPlayerIndex] = { name: card.owner, cardsCount: result[existPlayerIndex].cardsCount + 1 };
      }
    }

    this.players = result;
  }

  trackPlayersByName(index: number, item: PlayerInfo): string | undefined {
    return item ? item.name : undefined;
  }
}
