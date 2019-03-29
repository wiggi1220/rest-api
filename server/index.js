"use strict";

import Hapi from "hapi";
import { concat } from "ramda";
import { validate } from "../server/middleware/user";

import pkg from "../package";

const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

const routes = [
  ...require("./routes/user"),
  ...require("./routes/message"),
  require("./routes/login/registration"),
  require("./routes/login/authentication"),
  require("./routes/avatar/upload"),
  require("./routes/avatar/getAvatar")
];

const init = async () => {
  await server.register(require("hapi-auth-jwt2"));
  await server.register(require("inert"));

  server.auth.strategy("jwt", "jwt", {
    key: pkg.privateKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });
  server.auth.default("jwt");

  await server.register(routes);

  await server.start();

  return server;
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init()
  .then(server => console.log(`Server running at: ${server.info.uri}`))
  .catch(error => console.error(`Unable to start the server: ${error}`));
