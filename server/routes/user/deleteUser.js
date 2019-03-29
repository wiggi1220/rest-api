import { deleteUser } from "../../middleware/user";

exports.plugin = {
  name: "deleteUser",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "DELETE",
      path: "/api/users/{id}",
      handler: async (request, h) => {
        const id = request.params.id;
        const deletedId = await deleteUser(id);

        return h
          .response({ user_id: deletedId })
          .type("application/json")
          .code(200);
      }
    });
  }
};
