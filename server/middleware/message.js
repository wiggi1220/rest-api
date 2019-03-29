import crypto from "crypto";
import Boom from "boom";

import {
  getDatabase,
  findMessageById,
  findMessageInstanceById,
  findAllMessages,
  findAllMessagesByAuthor,
  createMessage,
  assignMessage,
  removeMessage
} from "../database";

class Message {
  constructor(message, author_id) {
    this.id = crypto.randomBytes(10).toString("hex");
    this.message = message;
    this.author_id = author_id || "unknown author";
    this.timestamp = Date.now().toString();
  }
}

const getMessageList = async () => {
  const db = await getDatabase();
  const messages = await findAllMessages(db);

  if (!messages) {
    throw Boom.notFound("messages not found");
  }

  return messages;
};

const getUserMessages = async user_id => {
  const db = await getDatabase();
  const messages = findAllMessagesByAuthor(db, user_id);

  return messages;
};

const getMessage = async id => {
  const db = await getDatabase();
  const message = findMessageById(db, id);

  if (!message) {
    throw Boom.notFound("message not found!");
  }

  return message;
};

const addMessage = async payload => {
  const db = await getDatabase();
  const newMessage = new Message(payload.message);
  const message = createMessage(db, newMessage);

  return message.id;
};

const updateMessage = async (id, updatedMessage) => {
  const db = await getDatabase();
  const messageInstance = await findMessageInstanceById(db, id);

  if (!messageInstance) {
    throw Boom.notFound("message not found!");
  }

  const assignedMessage = await assignMessage(messageInstance, updatedMessage);

  return assignedMessage.id;
};

const deleteMessage = async id => {
  const db = await getDatabase();
  const message = await findMessageById(db, id);

  if (!message) {
    throw Boom.notFound("message not found!");
  }

  await removeMessage(db, id);
  const removedMessage = await findMessageById(db, id);

  if (removedMessage) {
    throw Boom.badImplementation(`message with id: ${id} could not be removed`);
  }

  return id;
};

export {
  getMessageList,
  getUserMessages,
  getMessage,
  addMessage,
  updateMessage
};
