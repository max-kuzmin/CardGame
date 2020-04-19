import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameCardDto } from 'src/models/GameCardDto';
import { fromEvent } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

const frameDuration = 1000 / 60;

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  private isClicked = false;
  private clickOffset = { x: 0, y: 0 };

  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  @Input() readonly model: GameCardDto;
  @Output() readonly stateChanged: EventEmitter<GameCardDto> = new EventEmitter();

  get isRotated90(): boolean {
    return this.model.rotation === 90;
  }

  get isRotated180(): boolean {
    return this.model.rotation === 180;
  }

  get isRotated270(): boolean {
    return this.model.rotation === 270;
  }

  onCardMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0: {
        this.isClicked = true;
        this.clickOffset = { x: event.x - this.model.x, y: event.y - this.model.y };
        break;
      }

      case 1: {
        const updatedCard = {
          ...this.model,
          rotation: (this.model.rotation + 90) % 360
        };
        this.stateChanged.emit(updatedCard);
        break;
      }

      case 2: {
        const updatedCard = {
          ...this.model,
          isOpened: !this.model.isOpened
        };
        this.stateChanged.emit(updatedCard);
        break;
      }

      default: {
        break;
      }
    }
  }

  constructor() {
    this.mouseUpEvent.subscribe(() => this.onCardMouseUp());

    this.mouseMoveEvent
      .pipe(sampleTime(frameDuration))
      .subscribe(event => this.onCardMove(event));
  }

  private onCardMouseUp() {
    this.isClicked = false;
  }

  private onCardMove(event: MouseEvent) {
    if (!this.isClicked) {
      return;
    }

    const updatedCard = {
      ...this.model,
      x: event.x - this.clickOffset.x,
      y: event.y - this.clickOffset.y,
    };

    this.stateChanged.emit(updatedCard);
  }
}
