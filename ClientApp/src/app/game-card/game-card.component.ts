import { Component, Input } from '@angular/core';
import { GameCardDto } from 'src/models/GameCardDto';
import { fromEvent } from 'rxjs';
import { sampleTime } from 'rxjs/operators';
import { GameFieldService } from 'src/services/GameFieldService';
import { NumberOfCards, FrameDuration, CardWidth, CardHeight } from 'src/models/Constants';
import { CardCoordinatesDto } from '../../models/CardCoordinatesDto';
import { ZoneParams } from 'src/models/ZoneParams';
import { ActivatedRoute } from '@angular/router';
import { IsOutOfWindowBounds, CalculateClickOffset, CalculateCoords, isCardInside } from '../../helpers/MouseEventsHelpers';
import { Coords } from 'src/models/Coords';
import { MouseButtons } from 'src/models/MouseButtons';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  private isClicked = false;
  private clickOffset = new Coords();
  private userName: string;

  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  cardSize = { width: CardWidth, height: CardHeight };

  @Input() readonly model: GameCardDto;
  @Input() readonly personalZoneParams: ZoneParams;
  @Input() readonly throwZoneParams: ZoneParams;

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
      case MouseButtons.left: {
        this.isClicked = true;
        this.clickOffset = CalculateClickOffset(event, this.model);
        break;
      }

      case MouseButtons.middle: {
        const rotation = (this.model.rotation + 90) % 360;
        this.gameFieldService.setCardRotation(this.model.id, rotation);
        break;
      }

      case MouseButtons.right: {
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

    if (IsOutOfWindowBounds(event)) {
      return;
    }

    const coords = <CardCoordinatesDto>{
      id: this.model.id,
      ...CalculateCoords(event, this.clickOffset)
    };

    this.gameFieldService.setCardCoordinates(coords);

    this.checkCardInPersonalZone(coords);
    this.checkCardInThrowZone(coords);
  }

  private checkCardInPersonalZone(coords: CardCoordinatesDto): void {
    if (isCardInside(coords, this.cardSize, this.personalZoneParams)) {
      if (this.model.owner !== this.userName) {
        this.gameFieldService.setCardOwner(coords.id, this.userName);
      }
    } else {
      if (this.model.owner) {
        this.gameFieldService.setCardOwner(coords.id, undefined);
      }
    }
  }

  private checkCardInThrowZone(coords: CardCoordinatesDto): void {
    const isThrownNew = isCardInside(coords, this.cardSize, this.throwZoneParams);
    if (isThrownNew !== this.model.isThrown) {
      this.gameFieldService.setCardIsThrown(coords.id, isThrownNew);
    }
  }
}
