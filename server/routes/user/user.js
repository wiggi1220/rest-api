import { getUser } from "../../middleware/user";

exports.plugin = {
  name: "user",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/{id}",
      handler: async (request, h) => {
        const id = request.params.id;
        const user = await getUser(id);

        return h
          .response(user)
          .type("application/json")
          .code(200);
      }
    });
  }
};
