import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { SyncComponent } from './sync/sync.component';
import { SyncRecieveComponent } from './sync-recieve/sync-recieve.component';
import { PlayComponent } from './controlplay/play/play.component';
import { ControlComponent } from './controlplay/control/control.component';

@NgModule({
  declarations: [AppComponent, SyncComponent, SyncRecieveComponent, PlayComponent, ControlComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
