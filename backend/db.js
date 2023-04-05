const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DB connected');
  })
  .catch((e) => {
    console.log('Error connect to DB', e);
  });
