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
      const existPlayer = result.find(e => e.name === card.owner);
      if (!existPlayer) {
        result.push({ name: card.owner, cardsCount: 1 });
      } else {
        existPlayer.cardsCount++;
      }
    }

    this.players = result;
  }

  trackPlayersByName(index: number, item: PlayerInfo): string | undefined {
    return item ? item.name : undefined;
  }
}
