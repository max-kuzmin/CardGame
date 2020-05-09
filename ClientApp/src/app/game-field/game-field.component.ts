import { Component, Inject } from '@angular/core';
import { GameFieldService } from 'src/services/GameFieldService';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { GameCardDto } from 'src/models/GameCardDto';
import { ZoneParams } from 'src/models/ZoneParams';
import { PlayerDto } from 'src/models/PlayerDto';
import { PlayerInfo } from 'src/models/PlayerInfo';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { IsZoomedKey, UserNameKey } from 'src/models/Constants';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.css']
})
export class GameFieldComponent {
  private readonly keyDownEvent = fromEvent<KeyboardEvent>(document, 'keydown');

  userName: string | undefined;
  state: GameFieldStateDto = <GameFieldStateDto>{ cards: [], players: [] };
  playersInfo: PlayerInfo[] = [];
  isZoomed = false;
  throwZoneParams: ZoneParams;

  get personalZoneParams(): ZoneParams {
    const index = this.state.players.findIndex(e => e.name === this.userName);
    return index === -1 ? <ZoneParams> {} : this.state.players[index].personalZone;
  }

  get gameCards(): GameCardDto[] {
    return this.state.cards;
  }

  get players(): PlayerDto[] {
    return this.state.players;
  }

  constructor(
    private gameFieldService: GameFieldService,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.keyDownEvent.subscribe(event => this.onKeyDown(event));
    this.isZoomed = storage.has(IsZoomedKey) ? storage.get(IsZoomedKey) : false;

    if (this.storage.has(UserNameKey)) {
      this.onUserNameSet(this.storage.get(UserNameKey));
    }
  }

  trackCardsById(index: number, item: GameCardDto): number | undefined {
    return item ? item.id : undefined;
  }

  trackPlayerByName(index: number, item: PlayerDto): string | undefined {
    return item ? item.name : undefined;
  }

  updateThrowZoneParams(event: ZoneParams): void {
    this.throwZoneParams = event;
  }

  onUserNameSet(name: string): void {
    this.userName = name;
    this.gameFieldService.startConnection();
    this.gameFieldService.getState().subscribe(newState => {
      this.state = newState;
      this.updatePlayersStats();
    });

    this.gameFieldService.stateUpdated.subscribe(updatedState =>
      this.updateState(updatedState));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'z' || event.key === 'я') {
      this.isZoomed = !this.isZoomed;
      this.storage.set(IsZoomedKey, this.isZoomed);
    }
  }

  private updateState(updatedState: GameFieldStateDto): void {
    for (const card of updatedState.cards) {
      const oldIndex = this.state.cards.findIndex(e => e.id === card.id);
      if (oldIndex === -1) {
        this.state.cards.push(card);
      } else {
        this.state.cards.splice(oldIndex, 1, card);
      }
    }

    for (const player of updatedState.players) {
      const oldIndex = this.state.players.findIndex(e => e.name === player.name);
      if (oldIndex === -1) {
        this.state.players.push(player);
      } else {
        this.state.players.splice(oldIndex, 1, player);
      }
    }

    this.updatePlayersStats();
  }

  private updatePlayersStats() {
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
