import crypto from "crypto";
import bcrypt from "bcrypt";
import Boom from "boom";
import fs from "fs";
import path from "path";
import glob from "glob";

import {
  getDatabase,
  findUserById,
  findUserByNameOrEmail,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
} from "../database";
import { hashPassword } from "./encryption";

class User {
  constructor(username, email, password) {
    this.id = crypto.randomBytes(10).toString("hex");
    this.username = username;
    this.email = email;
    this.password = password;
    this.hasAvatar = false;
  }
}
const UPLOAD_PATH = "public/profile_pictures";

const getUserList = async () => {
  const db = await getDatabase();
  const users = await findAllUsers(db);

  if (!users) {
    throw Boom.notFound("users not found");
  }

  return users;
};

const getUser = async id => {
  const db = await getDatabase();
  const user = await findUserById(db, id);
  if (!user) {
    throw Boom.notFound("user not found!");
  }

  return user;
};

const addUser = async payload => {
  const db = await getDatabase();
  const { username, password, email } = payload;
  // think about try/ catch block structure
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User(username, email, hashedPassword);
    const user = await createUser(db, newUser);

    return user;
  } catch (err) {
    throw Boom.badImplementation(err);
  }
};

// TODO: specify in payload what to update (username | email | password )
const updateUser = async (id, payload) => {
  const db = await getDatabase();
  const user = await findUserById(db, id);

  if (!user) {
    throw Boom.notFound("user not found!");
  }

  const { password } = payload;
  let hashedPassword;

  if (password) {
    hashedPassword = await hashPassword(password);
  }

  const updatedUser = {
    ...payload,
    password: hashedPassword || user.password
  };

  const assignedUser = await assignUser(db, id, updatedUser);

  return assignedUser.id;
};

const deleteUser = async id => {
  const db = await getDatabase();
  const userExists = await findUserById(db, id);

  if (!userExists) {
    throw Boom.notFound("user not found!");
  }
  await removeUser(db, id);

  const removedUser = await findUserById(db, id);
  if (removedUser) {
    throw Boom.badImplementation(`user with id: ${id} could not be removed`);
  }

  return id;
};
const validate = async function(decoded, request) {
  const db = await getDatabase();
  if (!(await findUserById(db, decoded.id))) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

const verifyUniqueUser = async (request, h) => {
  const db = await getDatabase();
  const { username, email } = request.payload;

  const user = await findUserByNameOrEmail(db, username, email);
  if (user) {
    if (user.username === username) {
      throw Boom.badRequest("Username taken");
    }
    if (user.email === email) {
      throw Boom.badRequest("Email taken");
    }
  }
  // If everything checks out, send the payload through
  // to the route handler
  return h.response(request.payload);
};

const verifyCredentials = async (request, h) => {
  const { username, email, password } = request.payload;

  const db = await getDatabase();

  const user = await findUserByNameOrEmail(db, username, email);
  console.log("maio", request.payload, email);

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw Boom.badRequest("Incorrect password!");
    }
    // If everything checks out, send the user object through
    // to the route handler
    return h.response(user);
  } else {
    throw Boom.badRequest("Incorrect username or email!");
  }
};

const saveProfilePic = async (user_id, payload) => {
  return new Promise((resolve, reject) => {
    const uploadedFile = payload.file;

    if (!uploadedFile) {
      throw Boom.notFound("No file has been send");
    }
    const buffer_data = uploadedFile._data;

    if (!buffer_data) {
      throw Boom.notFound("No filedata existing");
    }
    const fileExtension = path.extname(uploadedFile.hapi.filename);

    if (
      fileExtension !== ".jpg" &&
      fileExtension !== ".jpeg" &&
      fileExtension !== ".png"
    ) {
      throw Boom.notAcceptable(
        `${fileExtension} is not an acceptable file format! It has to be .jpg, .jpeg or .png`
      );
    }

    const filename = path.format({
      root: __dirname,
      dir: UPLOAD_PATH,
      name: request.auth.credentials.id,
      ext: fileExtension
    });

    fs.writeFile(filename, buffer_data, err => {
      if (err) {
        console.err("There was a problem writing the file on disk", err);
        reject(err);
      }
      resolve(user_id);
    });
  });
};

const getFilePath = id => {
  // this is also possible with glob.sync and no callback at all
  const dir = process.cwd();

  return new Promise(function(resolve, reject) {
    glob(`${dir}/${UPLOAD_PATH}/${id}.*`, function(err, files) {
      if (err) {
        reject(err);
      }
      resolve(files[0]);
    });
  });
};

const addAvatar = id => {
  updateUser(id, { hasAvatar: true });
};

export {
  getUserList,
  getUser,
  addUser,
  getFilePath,
  updateUser,
  deleteUser,
  validate,
  verifyUniqueUser,
  verifyCredentials,
  saveProfilePic
};
