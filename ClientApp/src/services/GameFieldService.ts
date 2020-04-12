import { Injectable, Inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameFieldState } from 'src/models/GameFieldState';
import { HttpClient } from '@angular/common/http';

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
            .withUrl(this.baseUrl + 'gameField')
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection started');
                this.addListener();
            })
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public sendState(state: GameFieldState) {
        try {
            this.http.post<GameFieldState>(this.baseUrl + 'gameField', state);
        } catch (error) {
            console.error(error)
        }
    }

    private addListener() {
        this.hubConnection.on('ReceiveMessage', (data) => {
            if (this.onStateUpdated) {
                this.onStateUpdated(data);
            }
        });
        console.log('Listening')
    }
}
