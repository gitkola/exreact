const jwt = require('jsonwebtoken');

const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (tokenData, tokenKey = TOKEN_KEY, expiresIn = TOKEN_EXPIRY) => {
  const token = await jwt.sign(tokenData, tokenKey, { expiresIn });
  return token;
};

module.exports = createToken;
