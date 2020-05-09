import { ChangeDetectionStrategy, Input, Component } from '@angular/core';
import { MinResizeDelta } from 'src/models/Constants';
import { ResizedEvent } from 'angular-resize-event';
import { fromEvent } from 'rxjs';
import { IsOutOfWindowBounds, CalculateClickOffset, CalculateCoords } from '../../helpers/MouseEventsHelpers';
import { Coords } from 'src/models/Coords';
import { MouseButtons } from 'src/models/MouseButtons';
import { GameFieldService } from 'src/services/GameFieldService';
import { PlayerDto } from 'src/models/PlayerDto';
import { PersonalZoneParamsDto } from 'src/models/PersonalZoneParamsDto';

@Component({
  selector: 'app-personal-zone',
  templateUrl: './personal-zone.component.html',
  styleUrls: ['./personal-zone.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalZoneComponent {
  private isClicked = false;
  private clickOffset = new Coords();
  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  @Input() userName: string | undefined;
  @Input() model: PlayerDto;

  get isOwnPersonalZone(): boolean {
    return this.model.name === this.userName;
  }

  onResize(event: ResizedEvent): void {
    if (this.isOwnPersonalZone &&
      (Math.abs(event.newHeight - event.oldHeight) >= MinResizeDelta
      || Math.abs(event.newWidth - event.oldWidth) >= MinResizeDelta)) {
      const params = <PersonalZoneParamsDto> {
        ...this.model.personalZone,
        name: this.model.name,
        width: event.newWidth,
        height: event.newHeight
      };
      this.gameFieldService.setPersonalZoneParams(params);
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.isOwnPersonalZone && event.button === MouseButtons.left) {
      this.clickOffset = CalculateClickOffset(event, this.model.personalZone);
      this.isClicked = true;
    }
  }

  constructor(
    private gameFieldService: GameFieldService) {
    this.mouseUpEvent.subscribe(() => this.isClicked = false);
    this.mouseMoveEvent.subscribe(event => this.onMouseMove(event));
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isOwnPersonalZone || !this.isClicked || IsOutOfWindowBounds(event)) {
      return;
    }

    const params = <PersonalZoneParamsDto> {
      ...this.model.personalZone,
      name: this.model.name,
      ...CalculateCoords(event, this.clickOffset)
    };
    this.gameFieldService.setPersonalZoneParams(params);
  }
}
