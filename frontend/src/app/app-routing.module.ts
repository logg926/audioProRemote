import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecieverComponent } from './reciever/reciever-component/recieverVideo.component';
import { SenderComponentComponent } from './sender/sender-component/senderVideo.component';
import { SenderModule } from './sender/sender.module';
import { RecieverModule } from './reciever/reciever.module';

const routes: Routes = [
  { path: 'sender', component: SenderComponentComponent },
  { path: 'reciever', component: RecieverComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    SenderModule,
    RecieverModule,
  ],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
