import { Component, OnInit, Inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

import { DOCUMENT } from "@angular/common";
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}
}
