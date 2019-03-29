import { getFilePath } from "../../middleware/user";

exports.plugin = {
  name: "getAvatar",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/users/avatar/{id}",
      config: {
        auth: false
      },
      handler: async (request, h) => {
        const filepath = await getFilePath(request.params.id);

        return (
          h
            .file(filepath)
            // .response({ uri: filepath })

            .code(200)
        );
      }
    });
  }
};
