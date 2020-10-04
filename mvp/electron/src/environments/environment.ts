export const AppConfig = {
  production: false,
  environment: "LOCAL",
  graphqlEndpoint: "http://localhost:3000/graphql",
  auth: {
    clientID: "eIvfl1LzCqovz5gFBh3p52L3Ox2CbFwL",
    domain: "https://rehertztest.us.auth0.com/", // e.g., https://you.auth0.com/
    audience: "YOUR-AUTH0-API-IDENTIFIER", // e.g., http://localhost:3001
    redirect: "http://localhost:4200/callback",
    // scope: "openid profile email",
  },
};
