import { Component } from '@angular/core';
import { GameFieldService } from 'src/services/GameFieldService';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { GameCardDto } from 'src/models/GameCardDto';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.css']
})
export class GameFieldComponent {
  private state: GameFieldStateDto = <GameFieldStateDto>{ cards: [] };

  get gameCards(): GameCardDto[] {
    return this.state.cards;
  }

  constructor(private gameFieldService: GameFieldService) {
    gameFieldService.startConnection();
    gameFieldService.stateUpdated.subscribe(newState => this.state = newState);
    gameFieldService.getState().subscribe(newState => this.state = newState);
  }

  sendUpdate(updatedCard: GameCardDto) {
    const updates = <GameFieldStateDto> { cards: [ updatedCard ] };
    this.gameFieldService.sendUpdate(updates);
  }

  trackCardsById(index: number, item: GameCardDto): number | undefined {
    return item ? item.id : undefined;
  }
}
