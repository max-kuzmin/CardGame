import { Component } from '@angular/core';
import { GameFieldService } from 'src/services/GameFieldService';
import { GameFieldState } from 'src/models/GameFieldState';
import { Card } from 'src/models/Card';
import './game-field.component.css';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html'
})
export class GameFieldComponent {
  public currentState: GameFieldState;

  constructor(private gameFieldService: GameFieldService) {
    gameFieldService.startConnection();
    gameFieldService.onStateUpdated = newState => this.currentState = newState;
  }

  public moveCardAndSendState(e) {
    const cards: Card[] = [];
    cards.push(<Card> {
      Id: 1
    });

    this.gameFieldService.sendState(<GameFieldState> {Cards: cards});
  }
}
