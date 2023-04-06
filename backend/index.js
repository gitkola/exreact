require('dotenv').config();
require('./db');
const path = require('path');
const express = require('express');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const playlistRouter = require('./routes/playlist');
const auth = require('./middleware/auth');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/playlist', playlistRouter);

app.get('/status', (req, res) => {
  res.status(200).end('OK');
});

app.get('/auth_route', auth, (req, res) => {
  res.status(200).send(`Auth request. User email: ${req.user.email}, userId: ${req.user.userId}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
