import { addUser, verifyUniqueUser } from "../../middleware/user";
import { userSchema } from "../../schemas/user";

import createToken from "../../utils/jwt";
import Boom from "boom";

exports.plugin = {
  name: "registerUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users",
      config: {
        auth: false,
        pre: [{ method: verifyUniqueUser }],
        validate: {
          payload: userSchema
        }
      },
      handler: async (request, h) => {
        const user = await addUser(request.payload);

        if (!user) {
          throw Boom.badImplementation("User not created");
        }

        return h
          .response({ access_token: createToken(user) })
          .type("application/json")
          .code(200);
      }
    });
  }
};
