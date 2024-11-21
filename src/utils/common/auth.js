const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config/index');
const { JWT_SECRET, JWT_EXPIRES_IN } = ServerConfig;
const bcrypt = require('bcrypt');
const checkPassword = async (plainPassword, hashedPassword) => {
  console.log('plainPassword', plainPassword);
  console.log('hashedPassword', hashedPassword);
  return await bcrypt.compare(plainPassword, hashedPassword);
};
const createToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
module.exports = {
  checkPassword,
  createToken,
  verifyToken,
};
