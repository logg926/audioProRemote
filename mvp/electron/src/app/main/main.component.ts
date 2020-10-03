import { Component, OnInit } from "@angular/core";

import { AuthService } from "@auth0/auth0-angular";
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
