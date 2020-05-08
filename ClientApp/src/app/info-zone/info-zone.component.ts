import { Component, Input } from '@angular/core';
import { PlayerInfo } from 'src/models/PlayerInfo';
import { Coords } from 'src/models/Coords';
import { InfoZoneParams } from 'src/models/Constants';
import { GameCardDto } from '../../models/GameCardDto';

@Component({
  selector: 'app-info-zone',
  templateUrl: './info-zone.component.html',
  styleUrls: ['./info-zone.component.css']
})
export class InfoZoneComponent {
  model: Coords = InfoZoneParams;

  @Input() playersInfo: PlayerInfo[];

  trackPlayersByName(index: number, item: PlayerInfo): string | undefined {
    return item ? item.name : undefined;
  }
}
