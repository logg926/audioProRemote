import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";

import { Apollo } from "apollo-angular";

import gql from "graphql-tag";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class AuthButtonComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    private router: Router,
    private apollo: Apollo,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(["/menu"]);
      } else {
        // finish loading
      }
    });

    this.apollo
      .watchQuery({
        query: gql`
          {
            hello
          }
        `,
      })
      .valueChanges.subscribe((result) => {
        console.log(result);
      });
  }
}
