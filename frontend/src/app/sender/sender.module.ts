import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderComponentComponent } from './sender-component/senderVideo.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const config: SocketIoConfig = {
  url: 'http://localhost:8080',
  // options: { query: 'roomId=room1&peerName=Alicee' },
};
@NgModule({
  declarations: [SenderComponentComponent],
  imports: [CommonModule, SocketIoModule.forRoot(config)],
})
export class SenderModule {}
