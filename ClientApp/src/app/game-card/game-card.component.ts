import { Component, Input } from '@angular/core';
import { GameCardDto } from 'src/models/GameCardDto';
import { fromEvent } from 'rxjs';
import { sampleTime } from 'rxjs/operators';
import { GameFieldService } from 'src/services/GameFieldService';
import { NumberOfCards, FrameDuration, WindowOffset, CardWidth, CardHeight } from 'src/models/Constants';
import { CardCoordinatesDto } from '../../models/CardCoordinatesDto';
import { PersonalZoneParams } from 'src/models/PersonalZoneParams';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  private isClicked = false;
  private clickOffset = { x: 0, y: 0 };
  private userName: string;

  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  cardSize = { width: CardWidth, height: CardHeight };

  @Input() readonly model: GameCardDto;
  @Input() readonly personalZoneParams: PersonalZoneParams;

  get isRotated90(): boolean {
    return this.model.rotation === 90;
  }

  get isRotated180(): boolean {
    return this.model.rotation === 180;
  }

  get isRotated270(): boolean {
    return this.model.rotation === 270;
  }

  get isNotMyCard(): boolean {
    return !!this.model.owner && this.model.owner !== this.userName;
  }

  onCardMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0: {
        this.isClicked = true;
        this.clickOffset = { x: event.x - this.model.x, y: event.y - this.model.y };
        break;
      }

      case 1: {
        const rotation = (this.model.rotation + 90) % 360;
        this.gameFieldService.setCardRotation(this.model.id, rotation);
        break;
      }

      case 2: {
        this.gameFieldService.setCardIsOpened(this.model.id, !this.model.isOpened);
        break;
      }
    }

    if (this.model.order !== NumberOfCards) {
      this.gameFieldService.popCard(this.model.id);
    }
  }

  constructor(
    private gameFieldService: GameFieldService,
    route: ActivatedRoute) {
    route.queryParams.subscribe(params => this.userName = params['name']);

    this.mouseUpEvent.subscribe(() => this.onCardMouseUp());

    this.mouseMoveEvent
      .pipe(sampleTime(FrameDuration))
      .subscribe(event => this.onCardMove(event));
  }

  private onCardMouseUp() {
    this.isClicked = false;
  }

  private onCardMove(event: MouseEvent) {
    if (!this.isClicked || !this.userName) {
      return;
    }

    if (event.x < WindowOffset || event.x > event.view.innerWidth - WindowOffset
      || event.y < WindowOffset || event.y > event.view.innerHeight - WindowOffset) {
      return;
    }

    const coords = <CardCoordinatesDto>{
      id: this.model.id,
      x: event.x - this.clickOffset.x,
      y: event.y - this.clickOffset.y
    };

    this.gameFieldService.setCardCoordinates(coords);

    this.checkCardInPersonalZone(coords);
  }

  private checkCardInPersonalZone(coords: CardCoordinatesDto): void {
    const cardCenterX = coords.x + this.cardSize.width / 2;
    const cardCenterY = coords.y + this.cardSize.height / 2;

    const betweenX =
      cardCenterX > this.personalZoneParams.x &&
      cardCenterX < this.personalZoneParams.x + this.personalZoneParams.width;
    const betweenY =
      cardCenterY > this.personalZoneParams.y &&
      cardCenterY < this.personalZoneParams.y + this.personalZoneParams.height;

    if (betweenX && betweenY) {
      if (this.model.owner !== this.userName) {
        this.gameFieldService.setCardOwner(coords.id, this.userName);
      }
    } else {
      if (this.model.owner) {
        this.gameFieldService.setCardOwner(coords.id, undefined);
      }
    }
  }
}
