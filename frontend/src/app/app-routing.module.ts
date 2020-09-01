import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecieverComponentComponent } from './reciever-component/reciever-component.component';
import { SenderComponentComponent } from './sender-component/sender-component.component';

const routes: Routes = [
  { path: 'sender', component: SenderComponentComponent },
  { path: 'reciever', component: RecieverComponentComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [SenderComponentComponent, RecieverComponentComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
