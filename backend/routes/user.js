const router = require('express').Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const { createToken } = require('../utils/handleToken');
const { sendVerificationEmail } = require('../utils/sendEmail');

router.post('/signup', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (email === '' || password === '') {
      throw new Error('Empty input fields!');
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Invalid email!');
    } else if (password.length < 8) {
      throw new Error('Password is too short!');
    } else {
      const result = await User.find({ email });
      if (result.length) {
        throw new Error('User already exists!');
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
          verified: false,
        });
        const { _id } = await newUser.save();
        const uniqueString = uuidv4() + _id;
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        const newVerification = new UserVerification({
          userId: _id,
          uniqueString: hashedUniqueString,
          createdAt: Date.now(),
          expiresAt: Date.now() + 21600000,
        });
        await newVerification.save();
        await sendVerificationEmail({ _id, email, uniqueString });
        res.json({
          error: false,
          message: `Verification email sent to ${email}`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get('/verify/:userId/:uniqueString', async (req, res) => {
  try {
    const { userId, uniqueString } = req.params;
    const result = await UserVerification.find({ userId });
    if (result.length > 0) {
      const { expiresAt } = result[0];
      const hashedUniqueString = result[0].uniqueString;
      if (expiresAt < Date.now()) {
        await UserVerification.deleteOne({ userId });
        await User.deleteOne({ _id: userId });
        throw new Error('Verification link has expired. Please sign up again');
      } else {
        const data = await bcrypt.compare(uniqueString, hashedUniqueString);
        if (data) {
          await User.updateOne({ _id: userId }, { verified: true });
          await UserVerification.deleteOne({ userId });
          res.sendFile(path.join(__dirname, '../views/verified.html'));
        } else {
          throw new Error('Invalid verification details. Check your email inbox again.');
        }
      }
    } else {
      throw new Error("Account verification record doesn't exist or has been verified already. Please sign up or log in.");
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/user/verified?error=true&message=${error.message}`);
  }
});

router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/verified.html'));
});

router.post('/signin', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (email === '' || password === '') {
    res.json({
      error: true,
      message: 'Empty input fields!',
    });
  } else {
    User.find({ email })
      .then((data) => {
        if (data.length) {
          if (!data[0].verified) {
            res.json({
              error: true,
              message: "Email hasn't been verified yet. Please check your email inbox.",
            });
          } else {
            const hashedPassword = data[0].password;
            bcrypt.compare(password, hashedPassword)
              .then(async (result) => {
                if (result) {
                  // eslint-disable-next-line no-underscore-dangle
                  const tokenData = { userId: data[0]._id, email };
                  const token = await createToken(tokenData);
                  // eslint-disable-next-line no-underscore-dangle
                  const user = { _id: data[0]._id, email, token };
                  res.json({
                    error: false,
                    message: 'Signin successful',
                    user,
                  });
                } else {
                  res.json({
                    error: true,
                    message: 'Wrong email or password!',
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                res.json({
                  error,
                  message: 'An error occured while comparing passwords!',
                });
              });
          }
        } else {
          res.json({
            error: true,
            message: 'Wrong email!',
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error,
          message: 'An error occured while finding user!',
        });
      });
  }
});

module.exports = router;
