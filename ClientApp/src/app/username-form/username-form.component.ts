import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { UserNameKey } from 'src/models/Constants';
import { GameFieldService } from 'src/services/GameFieldService';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html',
  styleUrls: ['./username-form.component.css']
})
export class UserNameFormComponent {
  userName: string;
  isUserNameDefined: boolean;

  @Output() userNameSet = new EventEmitter<string>();

  constructor(
    private gameFieldService: GameFieldService,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.isUserNameDefined = this.storage.has(UserNameKey);
  }

  onSaveUserName(): void {
    if (this.userName && this.userName.length >= 3) {
      this.storage.set(UserNameKey, this.userName);
      this.isUserNameDefined = true;
      this.gameFieldService.addPlayer(this.userName)
        .add(e => this.userNameSet.emit(this.userName));
    }
  }
}
