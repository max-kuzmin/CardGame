import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameFieldStateDto } from 'src/models/GameFieldStateDto';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { tap } from 'rxjs/operators';

const gameFieldController = 'gameField';
const gameFieldHub = 'gameFieldHub';
const hubMethod = 'ReceiveState';

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

    public startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl + gameFieldHub)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                this.addListener();
            })
            .catch(err => console.error('Error while starting connection: ' + err));
    }

    public sendUpdate(state: GameFieldStateDto): void {
        this.http
            .post(this.baseUrl + gameFieldController, state)
            .subscribe(() => console.log('Send update for card ids: ' + state.cards.map(e => e.id).join(',')));
    }

    public getState(): Observable<GameFieldStateDto> {
        return this.http
            .get<GameFieldStateDto>(this.baseUrl + gameFieldController)
            .pipe(
                tap(() => console.log('Get initial state')));
    }

    private addListener() {
        this.hubConnection.on(hubMethod, (data) => {
            console.log('State received');
                this.stateUpdated.emit(data);
        });
        console.log('Listening...');
    }
}
