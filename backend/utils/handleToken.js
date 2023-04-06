const jwt = require('jsonwebtoken');

const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (tokenData, tokenKey = TOKEN_KEY, expiresIn = TOKEN_EXPIRY) => {
  const token = await jwt.sign(tokenData, tokenKey, { expiresIn });
  return token;
};

const verifyToken = async (token, tokenKey = TOKEN_KEY) => {
  try {
    const decodedToken = await jwt.verify(token, tokenKey);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { createToken, verifyToken };
