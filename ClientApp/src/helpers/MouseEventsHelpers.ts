import { WindowOffset } from 'src/models/Constants';
import { Coords } from 'src/models/Coords';
import { CardCoordinatesDto } from 'src/models/CardCoordinatesDto';
import { ZoneParams } from 'src/models/ZoneParams';
import { Size } from 'src/models/Size';

export function IsOutOfWindowBounds(event: MouseEvent): boolean {
    return event.x < WindowOffset
        || event.x > event.view.innerWidth - WindowOffset
        || event.y < WindowOffset
        || event.y > event.view.innerHeight - WindowOffset;
}

export function CalculateClickOffset(event: MouseEvent, model: Coords): Coords {
    return { x: event.x - model.x, y: event.y - model.y };
}

export function CalculateCoords(event: MouseEvent, clickOffset: Coords): Coords {
    return { x: event.x - clickOffset.x, y: event.y - clickOffset.y };
}

export function isCardInside(coords: CardCoordinatesDto, cardSize: Size, zoneParams: ZoneParams): boolean {
    const cardCenterX = coords.x + cardSize.width / 2;
    const cardCenterY = coords.y + cardSize.height / 2;

    const betweenX =
      cardCenterX > zoneParams.x &&
      cardCenterX < zoneParams.x + zoneParams.width;
    const betweenY =
      cardCenterY > zoneParams.y &&
      cardCenterY < zoneParams.y + zoneParams.height;

    return betweenX && betweenY;
  }
