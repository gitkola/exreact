require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../s3');
// const auth = require('./middleware/auth');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.post('/', upload.array('files'), (req, res) => {
  res.json({ message: 'Successfully uploaded files' });
});

module.exports = router;
