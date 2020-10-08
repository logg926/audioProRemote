import { Component, OnInit, Inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

import { Apollo } from "apollo-angular";
import { DOCUMENT } from "@angular/common";
import gql from "graphql-tag";
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    private router: Router,
    public auth: AuthService,
    private apollo: Apollo
  ) {}
  sendHello() {
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

  private getUser() {
    return this.apollo.watchQuery({
      query: gql`
        {
          user
        }
      `,
    }).valueChanges;
  }
  ngOnInit(): void {
    this.getUser().subscribe((result) => {
      console.log(result);
    });
  }
}
