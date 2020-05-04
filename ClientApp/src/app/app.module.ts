import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameFieldComponent } from './game-field/game-field.component';
import { GameCardComponent } from './game-card/game-card.component';
import { PersonalZoneComponent } from './personal-zone/personal-zone.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ThrowZoneComponent } from './throw-zone/throw-zone.component';
import { UserNameFormComponent } from './username-form/username-form.component';

@NgModule({
  declarations: [
    AppComponent,
    GameFieldComponent,
    GameCardComponent,
    PersonalZoneComponent,
    ThrowZoneComponent,
    UserNameFormComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AngularResizedEventModule,
    RouterModule.forRoot([
      { path: '', component: GameFieldComponent, pathMatch: 'full' },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
