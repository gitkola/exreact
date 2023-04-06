require('dotenv').config();
require('./db');
const path = require('path');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, getFileList } = require('./s3');
const userRouter = require('./routes/user');
const auth = require('./middleware/auth');

const bucketName = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.post('/upload_files', upload.array('files'), (req, res) => {
  res.json({ message: 'Successfully uploaded files' });
});

app.get('/status', (req, res) => {
  res.status(200).end('OK');
});

app.get('/api/playlist', async (req, res) => {
  const result = await getFileList();
  res.json(result);
});

app.get('/auth_route', auth, (req, res) => {
  res.status(200).send(`Auth request. User email: ${req.user.email}, userId: ${req.user.userId}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
