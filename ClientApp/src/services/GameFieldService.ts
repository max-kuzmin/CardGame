import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, } from 'rxjs';
import { tap } from 'rxjs/operators';

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

@Injectable({
    providedIn: 'root'
})
export class GameFieldService {
    private hubConnection: signalR.HubConnection;

    constructor(
        @Inject('BASE_URL') private baseUrl: string,
        private http: HttpClient) {
    }

    @Output() public stateUpdated: EventEmitter<GameFieldStateDto> = new EventEmitter();

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

    public setCardCoordinates(id: number, x: number, y: number): Subscription {
        return this.http
            .post(this.baseUrl + controller + setCardCoordinatesMethod, { id: id, x: x, y: y })
            .subscribe(() => console.log('Set card coordinates id ' + id));
    }

    public setCardOwner(id: number, value: string): Subscription {
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

    private addListener() {
        this.hubConnection.on(hubMethod, (data) => {
            console.log('State received');
            this.stateUpdated.emit(data);
        });
        console.log('Listening...');
    }
}
