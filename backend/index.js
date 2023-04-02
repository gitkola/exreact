require('dotenv').config();
const path = require('path');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, getFileList } = require('./s3');

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
app.use(express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function uploadFiles(req, res) {
  res.json({ message: 'Successfully uploaded files' });
}
app.post('/upload_files', upload.array('files'), uploadFiles);

app.get('/status', (req, res) => {
  res.status(200).end('OK');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'success',
  });
});

app.get('/api/playlist', async (req, res) => {
  const result = await getFileList();
  res.json(result);
});

app.get('/api/track/:trackName', (req, res) => {
  const trackName = req.params;
  res.download(path.join(__dirname, `../uploads/${trackName}`));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
