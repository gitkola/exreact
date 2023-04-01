const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express(); // create express app

// add middlewares
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

app.get('/api/playlist', (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    return res.json(files.map((file) => (
      {
        title: file,
        src: file,
      })));
  });
});

app.get('/api/track/:trackName', (req, res) => {
  const trackName = req.params;
  res.download(path.join(__dirname, `../uploads/${trackName}`));
});

// start express server on port 5000
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
