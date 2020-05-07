import { Component, Input, Inject, ChangeDetectionStrategy } from '@angular/core';
import { GameCardDto } from 'src/models/GameCardDto';
import { fromEvent } from 'rxjs';
import { GameFieldService } from 'src/services/GameFieldService';
import { NumberOfCards, CardWidth, CardHeight, UserNameKey } from 'src/models/Constants';
import { CardCoordinatesDto } from '../../models/CardCoordinatesDto';
import { ZoneParams } from 'src/models/ZoneParams';
import { IsOutOfWindowBounds, CalculateClickOffset, CalculateCoords, isCardInside } from '../../helpers/MouseEventsHelpers';
import { Coords } from 'src/models/Coords';
import { MouseButtons } from 'src/models/MouseButtons';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCardComponent {
  private isClicked = false;
  private clickOffset = new Coords();
  private get userName(): string | undefined {
    return this.storage.has(UserNameKey) ? this.storage.get(UserNameKey) : undefined;
  }

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

  get backgroundSize(): string {
    return `${this.cardSize.width}px ${this.cardSize.height}px`;
  }

  get backgroundSizeZoom(): string {
    return `${this.cardSize.width * 2}px ${this.cardSize.height * 2}px`;
  }

  get widthZoom(): number {
    return this.cardSize.width / 4 * 1.4;
  }

  get leftZoom(): number {
    return this.cardSize.width / 4 * 2.6 - 1;
  }

  get backgroundImage(): string {
    if (this.model.isOpened) {
      return 'url(' + require(`../../images/${this.model.id + 1}.jpg`) + ')';
    } else {
      return 'url(' + require('../../images/back.jpg') + ')';
    }
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
    @Inject(SESSION_STORAGE) private storage: StorageService) {

    this.mouseUpEvent.subscribe(() => this.onCardMouseUp());

    this.mouseMoveEvent
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
