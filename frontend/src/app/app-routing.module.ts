import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecieverComponent } from './video/reciever-component/recieverVideo.component';
import { SenderComponent } from './video/sender-component/senderVideo.component';
import { VideoAPIModule } from './video/VideoAPI.module';

const routes: Routes = [
  { path: 'sender', component: SenderComponent },
  { path: 'reciever', component: RecieverComponent },
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
