import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components";

import { LoginRoutingModule } from "./login/login-routing.module";
import { MenuRoutingModule } from "./menu/menu-routing.module";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginRoutingModule,
    MenuRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
