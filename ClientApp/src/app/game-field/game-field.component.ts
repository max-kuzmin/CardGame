import { Component, Inject } from '@angular/core';
import { GameFieldService } from 'src/services/GameFieldService';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { GameCardDto } from 'src/models/GameCardDto';
import { ZoneParams } from 'src/models/ZoneParams';
import { PlayerLabelDto } from 'src/models/PlayerLabelDto';
import { PlayerInfo } from 'src/models/PlayerInfo';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { IsZoomedKey } from 'src/models/Constants';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.css']
})
export class GameFieldComponent {
  private readonly keyDownEvent = fromEvent<KeyboardEvent>(document, 'keydown');

  state: GameFieldStateDto = <GameFieldStateDto>{ cards: [], playerLabels: [] };
  playersInfo: PlayerInfo[] = [];
  isZoomed = false;

  personalZoneParams: ZoneParams;
  throwZoneParams: ZoneParams;

  get gameCards(): GameCardDto[] {
    return this.state.cards;
  }

  get playerLabels(): PlayerLabelDto[] {
    return this.state.playerLabels;
  }

  constructor(
    gameFieldService: GameFieldService,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    gameFieldService.startConnection();
    gameFieldService.stateUpdated.subscribe(updatedState =>
      this.updateState(updatedState));
    gameFieldService.getState().subscribe(newState => {
      this.state = newState;
      this.updatePlayersInfo();
    });

    this.keyDownEvent.subscribe(event => this.onKeyDown(event));
    this.isZoomed = storage.has(IsZoomedKey) ? storage.get(IsZoomedKey) : false;
  }

  trackCardsById(index: number, item: GameCardDto): number | undefined {
    return item ? item.id : undefined;
  }

  trackPlayerLabelByName(index: number, item: PlayerLabelDto): string | undefined {
    return item ? item.name : undefined;
  }

  updatePersonalZoneParams(event: ZoneParams): void {
    this.personalZoneParams = event;
  }

  updateThrowZoneParams(event: ZoneParams): void {
    this.throwZoneParams = event;
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'z' || event.key === 'я') {
      this.isZoomed = !this.isZoomed;
      this.storage.set(IsZoomedKey, this.isZoomed);
    }
  }

  private updateState(updatedState: GameFieldStateDto): void {
    for (const card of updatedState.cards) {
      const oldCardIndex = this.state.cards.findIndex(e => e.id === card.id);
      if (oldCardIndex === -1) {
        this.state.cards.push(card);
      } else {
        this.state.cards.splice(oldCardIndex, 1, card);
      }
    }

    for (const label of updatedState.playerLabels) {
      const oldLabelIndex = this.state.playerLabels.findIndex(e => e.name === label.name);
      if (oldLabelIndex === -1) {
        this.state.playerLabels.push(label);
      } else {
        this.state.playerLabels.splice(oldLabelIndex, 1, label);
      }
    }

    this.updatePlayersInfo();
  }

  private updatePlayersInfo() {
    const newPlayersInfoMap = this.state.cards.reduce((total, value) => {
      if (value.owner) {
        total[value.owner] = (total[value.owner] || 0) + 1;
      }
      return total;
    }, {});
    this.playersInfo = Object.entries(newPlayersInfoMap)
        .map(item => <PlayerInfo>{ name: item[0], cardsCount: item[1] });
  }
}
