import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecieverComponent } from './video/reciever-component/recieverVideo.component';
import { SenderComponent } from './video/sender-component/senderVideo.component';
import { VideoAPIModule } from './video/VideoAPI.module';
import { SyncComponent } from './sync/sync.component';
import { SyncRecieveComponent } from './sync-recieve/sync-recieve.component';
import { PlayComponent } from './controlplay/play/play.component';
import { ControlComponent } from './controlplay/control/control.component';

const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'reciever', component: RecieverComponent },
  { path: 'sync', component: SyncComponent },
  { path: 'sync-recieve', component: SyncRecieveComponent },
  { path: 'play', component: PlayComponent },
  { path: 'control', component: ControlComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    VideoAPIModule,
  ],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
