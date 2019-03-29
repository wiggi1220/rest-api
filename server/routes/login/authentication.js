import { verifyCredentials } from "../../middleware/user";
import { loginUser } from "../../schemas/user";

import createToken from "../../utils/jwt";

exports.plugin = {
  name: "authenticateUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/login",
      config: {
        auth: false,
        pre: [{ method: verifyCredentials, assign: "user" }],
        validate: {
          payload: loginUser
        }
      },
      handler: async (request, h) => {
        return h
          .response({ access_token: createToken(request.pre.user) })
          .type("application/json")
          .code(200);
      }
    });
  }
};
