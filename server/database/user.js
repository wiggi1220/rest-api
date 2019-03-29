"use-strict";

import { partial } from "ramda";

const findUser = async (db, finder) => {
  const user = await db
    .get("users")
    .find(finder)
    .value();
  return user;
};

const findUserById = (db, id) => {
  return findUser(db, { id });
};

const findUserByUserName = (db, username) => {
  return findUser(db, { username });
};

const findUserByEmail = (db, email) => {
  return findUser(db, { email });
};

const finderUsernameOrEmail = (username, email, user) =>
  user.email === email || user.username === username;

const findUserByNameOrEmail = async (db, username, email) =>
  findUser(db, partial(finderUsernameOrEmail, [username, email]));

const findAllUsers = async db => {
  const users = await db.get("users").value();
  return users;
};

const createUser = (db, newUser) => {
  return db
    .get("users")
    .push(newUser)
    .last()
    .write();
};

const assignUser = (db, id, updatedUser) => {
  // check what is returned
  return db
    .get("users")
    .find({ id })
    .assign(updatedUser)
    .write();
};

const removeUser = (db, id) => {
  db.get("users")
    .remove({ id })
    .write();
};

export {
  findUserById,
  findUserByUserName,
  findUserByEmail,
  findUserByNameOrEmail,
  findAllUsers,
  createUser,
  assignUser,
  removeUser
};
