const router = require('express').Router();
const { getFileList } = require('../s3');
// const auth = require('./middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await getFileList();
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
