import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CardCoordinatesDto } from 'src/models/CardCoordinatesDto';
import { PlayerLabelCoordinatesDto } from 'src/models/PlayerLabelCoordinatesDto';
import { PersonalZoneParamsDto } from 'src/models/PersonalZoneParamsDto';

const controller = 'gameField';
const hub = 'gameFieldHub';
const hubMethod = 'ReceiveState';
const getStateMethod = '/getState';
const popCardMethod = '/popCard';
const setCardRotationMethod = '/setCardRotation';
const setCardCoordinatesMethod = '/setCardCoordinates';
const setCardOwnerMethod = '/setCardOwner';
const setCardIsOpenedMethod = '/setCardIsOpened';
const setCardIsThrownMethod = '/setCardIsThrown';
const addPlayerMethod = '/addPlayer';
const setPlayerLabelCoordinatesMethod = '/setPlayerLabelCoordinates';
const setPersonalZoneParamsMethod = '/setPersonalZoneParams';

@Injectable({
    providedIn: 'root'
})
export class GameFieldService {
    private hubConnection: signalR.HubConnection;

    constructor(
        @Inject('BASE_URL') private baseUrl: string,
        private http: HttpClient) {
    }

    @Output() public stateUpdated = new EventEmitter<GameFieldStateDto>();

    public startConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl + hub)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                this.addListener();
            })
            .catch(err => console.error('Error while starting connection: ' + err));
    }

    public getState(): Observable<GameFieldStateDto> {
        return this.http
            .get<GameFieldStateDto>(this.baseUrl + controller + getStateMethod)
            .pipe(
                tap(() => console.log('Get initial state')));
    }

    public popCard(id: number): Subscription {
        return this.http
            .post(this.baseUrl + controller + popCardMethod, id)
            .subscribe(() => console.log('Pop card id ' + id));
    }

    public setCardRotation(id: number, value: number): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardRotationMethod, { id: id, value: value })
            .subscribe(() => console.log('Set card rotation id ' + id));
    }

    public setCardCoordinates(coords: CardCoordinatesDto): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardCoordinatesMethod, coords)
            .subscribe(() => console.log('Set card coordinates id ' + coords.id));
    }

    public setCardOwner(id: number, value: string | undefined): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardOwnerMethod, { id: id, value: value })
            .subscribe(() => console.log('Set card owner id ' + id));
    }

    public setCardIsOpened(id: number, value: boolean): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardIsOpenedMethod, { id: id, value: value })
            .subscribe(() => console.log('Set card isOpened id ' + id));
    }

    public setCardIsThrown(id: number, value: boolean): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardIsThrownMethod, { id: id, value: value })
            .subscribe(() => console.log('Set card setCard isThrown id ' + id));
    }

    public addPlayer(name: string): Subscription {
        return this.http
            .post(this.baseUrl + controller + addPlayerMethod, { name: name })
            .subscribe(() => console.log('Add player - ' + name));
    }

    public setPlayerLabelCoordinates(coords: PlayerLabelCoordinatesDto): Subscription {
        return this.http
            .post(this.baseUrl + controller + setPlayerLabelCoordinatesMethod, coords)
            .subscribe(() => console.log('Set player label coords for ' + coords.name));
    }

    public setPersonalZoneParams(model: PersonalZoneParamsDto): Subscription {
        return this.http
            .post(this.baseUrl + controller + setPersonalZoneParamsMethod, model)
            .subscribe(() => console.log('Set personal zone params for ' + model.name));
    }

    private addListener() {
        this.hubConnection.on(hubMethod, (data) => {
            console.log('State received');
            this.stateUpdated.emit(data);
        });
        console.log('Listening...');
    }
}
