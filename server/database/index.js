import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import path from "path";

import {
  findMessageById,
  findMessageInstanceById,
  findAllMessages,
  findAllMessagesByAuthor,
  createMessage,
  assignMessage,
  removeMessage
} from "./message";

import {
  findUserById,
  findUserByUserName,
  findUserByEmail,
  findUserByNameOrEmail,
  findUser,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
} from "./user";

const getDatabase = () => {
  const dbDir = path.join(__dirname, "..", "..", "data", "db.json");
  const adapter = new FileAsync(dbDir);
  return low(adapter);
};

export {
  getDatabase,
  findMessageById,
  findMessageInstanceById,
  findAllMessages,
  findAllMessagesByAuthor,
  createMessage,
  assignMessage,
  removeMessage,
  findUserById,
  findUserByUserName,
  findUserByEmail,
  findUserByNameOrEmail,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
};
