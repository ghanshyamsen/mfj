// socketStore.js

let ioInstance = null;
const connectedUsers = new Map();

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  return ioInstance;
}

function getSocketId(userId) {
  return connectedUsers.get(userId);
}

module.exports = {
  setIo,
  getIo,
  getSocketId,
  connectedUsers,
};
