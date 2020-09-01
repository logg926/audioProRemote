import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SenderComponentComponent } from './sender-component/sender-component.component';
import { RecieverComponentComponent } from './reciever-component/reciever-component.component';

const config: SocketIoConfig = {
  url: 'http://localhost:8080',
  options: { query: 'roomId=room1&peerName=Alicee' },
};
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SocketIoModule.forRoot(config)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
