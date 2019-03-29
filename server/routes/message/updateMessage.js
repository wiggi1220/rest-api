import { updateMessage } from "../../middleware/message";
import { messageSchema } from "../../schemas/message";

exports.plugin = {
  name: "updateMessage",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/messages/{id}",
      options: {
        validate: {
          payload: messageSchema
        }
      },
      handler: async (request, h) => {
        const id = request.params.id;
        const updatedMessage = await updateMessage(id, request.payload);

        return h
          .response(updatedMessage)
          .type("application/json")
          .code(200);
      }
    });
  }
};
