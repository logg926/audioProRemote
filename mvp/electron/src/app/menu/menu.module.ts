import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuRoutingModule } from "./menu-routing.module";

import { MenuComponent } from "./menu.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, SharedModule, MenuRoutingModule],
})
export class MenuModule {}
