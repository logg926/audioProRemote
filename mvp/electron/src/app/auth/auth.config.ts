// import { HttpMethod } from "@auth0/auth0-angular";

import { AppConfig } from "environments/environment";

// Modify your existing SDK configuration to include the httpInterceptor config
export const AuthConfig = {
  domain: AppConfig.auth.domain,
  clientId: AppConfig.auth.clientID,
  audience: AppConfig.auth.audience,
  // redirectUri: window.location.origin,

  // The AuthHttpInterceptor configuration
  httpInterceptor: {
    allowedList: [
      // Using an absolute URI
      AppConfig.graphqlEndpoint,
    ],
  },
};
