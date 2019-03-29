import { getMessage } from "../../middleware/message";

exports.plugin = {
  name: "message",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/messages/{id}",
      handler: async (request, h) => {
        const id = request.params.id;
        const message = await getMessage(id);

        return h
          .response(message)
          .type("application/json")
          .code(200);
      }
    });
  }
};
