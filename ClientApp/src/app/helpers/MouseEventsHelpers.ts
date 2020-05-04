import { WindowOffset } from 'src/models/Constants';
import { Coords } from 'src/models/Coords';

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
