import { deleteMessage } from "../../middleware/message";

exports.plugin = {
  name: "deleteMessage",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "DELETE",
      path: "/api/messages/{id}",
      handler: async (request, h) => {
        const id = request.params.id;
        const deletedId = await deleteMessage(id);

        return h
          .response(deletedId)
          .type("application/json")
          .code(200);
      }
    });
  }
};
