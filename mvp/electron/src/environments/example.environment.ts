//CHANGE THIS FILE TO environment.web.ts

export const AppConfig = {
  production: false,
  environment: "WEB",
  graphqlEndpoint: "http://localhost:3000/graphql",
  auth: {
    clientID: "clientID-HERE",
    domain: "domain-HERE", // e.g., https://you.auth0.com/
    audience: "https://rehertzv1/", // e.g., http://localhost:3001
    redirect: "http://localhost:4200",
    // scope: "openid profile email",
  },
};
