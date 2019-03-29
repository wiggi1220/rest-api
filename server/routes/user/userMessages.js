import { getUserMessages } from "../../middleware/message";

exports.plugin = {
  name: "userMessages",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/{id}/messages",
      handler: async (request, h) => {
        const id = request.params.id;
        const user = await getUserMessages(id);

        return h
          .response(user)
          .type("application/json")
          .code(200);
      }
    });
  }
};
