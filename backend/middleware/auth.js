const { verifyToken } = require('../utils/handleToken');

const auth = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send('An authentication token is required');
  }

  try {
    const decodedToken = await verifyToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.log(error);
    return res.status(401).send(error.message);
  }

  return next();
};

module.exports = auth;
