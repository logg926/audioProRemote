import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { AppRoutingModule } from "./app-routing.module";

// NG Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { LoginModule } from "./login/login.module";
import { MenuModule } from "./menu/menu.module";

import { AppComponent } from "./app.component";
import { AuthModule } from "@auth0/auth0-angular";

import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { GraphQLModule } from "./graphql/graphql.module";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AuthHttpInterceptor } from "@auth0/auth0-angular";
import { AuthConfig } from "./auth/auth.config";
import { AppConfig } from "./../environments/environment";
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    GraphQLModule,
    BrowserModule,
    ApolloModule,
    HttpLinkModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LoginModule,
    MenuModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    AuthModule.forRoot(AuthConfig),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    // {
    //   provide: APOLLO_OPTIONS,
    //   useFactory: (httpLink: HttpLink) => {
    //     return {
    //       cache: new InMemoryCache(),
    //       link: httpLink.create({
    //         uri: AppConfig.graphqlEndpoint,
    //       }),
    //     };
    //   },
    //   deps: [HttpLink],
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
