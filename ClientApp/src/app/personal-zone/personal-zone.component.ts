import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ZoneParams } from 'src/models/ZoneParams';
import { InitPersonalZoneParams, MinResizeDelta } from 'src/models/Constants';
import { ResizedEvent } from 'angular-resize-event';
import { fromEvent } from 'rxjs';
import { IsOutOfWindowBounds, CalculateClickOffset, CalculateCoords } from '../../helpers/MouseEventsHelpers';
import { Coords } from 'src/models/Coords';
import { MouseButtons } from 'src/models/MouseButtons';

@Component({
  selector: 'app-personal-zone',
  templateUrl: './personal-zone.component.html',
  styleUrls: ['./personal-zone.component.css']
})
export class PersonalZoneComponent implements OnInit {
  private isClicked = false;
  private clickOffset = new Coords();
  private readonly mouseMoveEvent = fromEvent<MouseEvent>(document, 'mousemove');
  private readonly mouseUpEvent = fromEvent<MouseEvent>(document, 'mouseup');

  model: ZoneParams = InitPersonalZoneParams;
  @Output() paramsChanged = new EventEmitter<ZoneParams>();

  ngOnInit(): void {
    this.paramsChanged.emit(this.model);
  }

  onResize(event: ResizedEvent): void {
    if (Math.abs(event.newHeight - event.oldHeight) >= MinResizeDelta
      || Math.abs(event.newWidth - event.oldWidth) >= MinResizeDelta) {
      this.model = { ...this.model, width: event.newWidth, height: event.newHeight };
      this.paramsChanged.emit(this.model);
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === MouseButtons.left) {
      this.clickOffset = CalculateClickOffset(event, this.model);
      this.isClicked = true;
    }
  }

  constructor() {
    this.mouseUpEvent.subscribe(() => this.isClicked = false);
    this.mouseMoveEvent.subscribe(event => this.onMouseMove(event));
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isClicked || IsOutOfWindowBounds(event)) {
      return;
    }

    this.model = { ...this.model, ...CalculateCoords(event, this.clickOffset) };
    this.paramsChanged.emit(this.model);
  }
}
