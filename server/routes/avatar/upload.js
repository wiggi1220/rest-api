import { saveProfilePic } from "../../middleware/user";

exports.plugin = {
  name: "uploadAvatar",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/{user_id}/avatar",
      options: {
        payload: {
          maxBytes: 1000 * 1000,
          output: "stream",
          parse: true,
          allow: "multipart/form-data"
        }
      },
      handler: async (request, h) => {
        const user_id = request.params.user_id;
        const payload = request.payload;
        const uploadSuccess = await saveProfilePic(user_id, payload);
        uploadSuccess.then(addAvatar);
        return h
          .response({ status: "success" })
          .type("application/json")
          .code(200);
      }
    });
  }
};
