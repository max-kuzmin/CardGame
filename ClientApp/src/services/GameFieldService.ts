import { Injectable, Inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameFieldState } from 'src/models/GameFieldState';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    public onStateUpdated: (state: GameFieldState) => void;

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

    public sendUpdate(state: GameFieldState): void {
        this.http.post<GameFieldState>(this.baseUrl + gameFieldController, state)
            .subscribe(() => console.log('Update send: ' + JSON.stringify(state)));
    }

    public getState(): Observable<GameFieldState> {
        console.log('Get state');
        return this.http.get<GameFieldState>(this.baseUrl + gameFieldController);
    }

    private addListener() {
        this.hubConnection.on(hubMethod, (data) => {
            if (this.onStateUpdated) {
                console.log('Update received');
                this.onStateUpdated(data);
            }
        });
        console.log('Listening...');
    }
}
