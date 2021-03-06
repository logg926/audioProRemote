export const AppConfig = {
  production: false,
  environment: "WEB",
  graphqlEndpoint: "http://localhost:3000/graphql",
  auth: {
    clientID: "5EURlbsB3L6cVxQFSCTCGgQOtgBc29E2",
    domain: "rehertztest.us.auth0.com", // e.g., https://you.auth0.com/
    audience: "https://rehertzv1/", // e.g., http://localhost:3001
    redirect: "http://localhost:4200",
    // scope: "openid profile email",
  },
};
