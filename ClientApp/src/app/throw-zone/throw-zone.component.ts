import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ZoneParams } from 'src/models/ZoneParams';
import { ThrowZoneParams } from 'src/models/Constants';

@Component({
  selector: 'app-throw-zone',
  templateUrl: './throw-zone.component.html',
  styleUrls: ['./throw-zone.component.css']
})
export class ThrowZoneComponent implements OnInit {
  model: ZoneParams = ThrowZoneParams;
  @Output() paramsChanged = new EventEmitter<ZoneParams>();

  ngOnInit(): void {
    this.paramsChanged.emit(this.model);
  }
}
