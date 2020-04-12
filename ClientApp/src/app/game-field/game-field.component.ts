import { Component, HostListener } from '@angular/core';
import { GameFieldService } from 'src/services/GameFieldService';
import { GameFieldState } from 'src/models/GameFieldState';
import { Card } from 'src/models/Card';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.css']
})
export class GameFieldComponent {
  public currentState: GameFieldState = <GameFieldState>{ cards: [] };
  private clickedId: number | undefined;

  constructor(private gameFieldService: GameFieldService) {
    gameFieldService.startConnection();
    gameFieldService.onStateUpdated = newState => this.currentState = newState;
    gameFieldService.getState().subscribe(result => this.currentState = result);
  }

  public onCardMouseDown(event: MouseEvent, card: Card) {
    if (event.button === 0) {
      this.clickedId = card.id;
    }

    if (event.button === 1) {
      card = { ...card };
      card.isOpened = !card.isOpened;
      this.sendUpdate(card);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  private onCardMouseUp() {
    this.clickedId = undefined;
  }

  @HostListener('document:mousemove', ['$event'])
  private onCardMove(event: MouseEvent) {
    if (!this.clickedId) {
      return;
    }

    let card = this.currentState.cards.find(e => e.id === this.clickedId);
    card = { ...card };
    card.x += event.movementX;
    card.y += event.movementY;

    this.sendUpdate(card);
  }

  private sendUpdate(card: Card) {
    const updates = <GameFieldState> { cards: [ card ] };
    this.gameFieldService.sendUpdate(updates);
  }
}
