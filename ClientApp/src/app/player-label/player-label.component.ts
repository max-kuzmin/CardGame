import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { IsOutOfWindowBounds, CalculateClickOffset, CalculateCoords } from '../../helpers/MouseEventsHelpers';
import { Coords } from 'src/models/Coords';
import { MouseButtons } from 'src/models/MouseButtons';
import { GameFieldService } from 'src/services/GameFieldService';
import { PlayerLabelDto } from 'src/models/PlayerLabelDto';

@Component({
  selector: 'app-player-label',
  templateUrl: './player-label.component.html',
  styleUrls: ['./player-label.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerLabelComponent {
  private isClicked = false;
  private clickOffset = new Coords();
  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  @Input() model: PlayerLabelDto;

  onMouseDown(event: MouseEvent): void {
    if (event.button === MouseButtons.left) {
      this.clickOffset = CalculateClickOffset(event, this.model);
      this.isClicked = true;
    }
  }

  constructor(private gameFieldService: GameFieldService) {
    this.mouseUpEvent.subscribe(() => this.isClicked = false);
    this.mouseMoveEvent
      .subscribe(event => this.onMouseMove(event));
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isClicked || IsOutOfWindowBounds(event)) {
      return;
    }

    const newModel = { name: this.model.name, ...CalculateCoords(event, this.clickOffset) };
    this.gameFieldService.setPlayerLabelCoordinates(newModel);
  }
}
