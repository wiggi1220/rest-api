import { updateUser } from "../../middleware/user";
import { updateSchema } from "../../schemas/user";

exports.plugin = {
  name: "updateUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/{id}",
      options: {
        validate: {
          payload: updateSchema
        }
      },
      handler: async (request, h) => {
        const id = request.params.id;
        const updatedUserId = await updateUser(id, request.payload);

        return h
          .response({ user_id: updatedUserId })
          .type("application/json")
          .code(200);
      }
    });
  }
};
