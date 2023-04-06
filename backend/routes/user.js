const router = require('express').Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const createToken = require('../utils/createToken');
const { sendVerificationEmail } = require('../utils/sendEmail');

router.post('/signup', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (email === '' || password === '') {
    res.json({
      error: true,
      message: 'Empty input fields!',
    });
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      error: true,
      message: 'Invalid email!',
    });
  } else if (password.length < 8) {
    res.json({
      error: true,
      message: 'Password is too short!',
    });
  } else {
    User.find({ email }).then((result) => {
      if (result.length) {
        res.json({
          error: true,
          message: 'User already exists!',
        });
      } else {
        bcrypt.hash(password, 10).then((hashedPassword) => {
          const newUser = new User({
            email,
            password: hashedPassword,
            verified: false,
          });
          newUser.save().then(({ _id }) => {
            const uniqueString = uuidv4() + _id;
            bcrypt
              .hash(uniqueString, 10)
              .then((hashedUniqueString) => {
                const newVerification = new UserVerification({
                  userId: _id,
                  uniqueString: hashedUniqueString,
                  createdAt: Date.now(),
                  expiresAt: Date.now() + 21600000,
                });

                newVerification
                  .save()
                  .then(async () => {
                    try {
                      await sendVerificationEmail({ _id, email, uniqueString });
                      res.json({
                        error: false,
                        message: 'Verification email sent.',
                      });
                    } catch (error) {
                      console.log(error);
                      res.json({
                        error,
                        message: 'An error occured while sending verification code!',
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    res.json({
                      error,
                      message: 'An error occured while saving verification code!',
                    });
                  });
              })
              .catch((error) => {
                res.json({
                  error,
                  message: 'An error occured while hashing verification code!',
                });
              });
          }).catch((error) => {
            console.log(error);
            res.json({
              error,
              message: 'An error occured while saving user account!',
            });
          });
        }).catch((error) => {
          console.log(error);
          res.json({
            error,
            message: 'An error occured while hashing the password!',
          });
        });
      }
    }).catch((error) => {
      console.log(error);
      res.json({
        error,
        message: 'An error occured while checking for existing user!',
      });
    });
  }
});

router.get('/verify/:userId/:uniqueString', (req, res) => {
  const { userId, uniqueString } = req.params;

  UserVerification
    .find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          UserVerification
            .deleteOne({ userId })
            .then(() => {
              User
                .deleteOne({ _id: userId })
                .then(() => {
                  const message = 'Verification link has expired. Please sign up again';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  const message = 'An error occured while clearing user with expired verification record.';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              const message = 'An error occured while clearing expired user verification record.';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((data) => {
              if (data) {
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(path.join(__dirname, '../views/verified.html'));
                      })
                      .catch((error) => {
                        console.log(error);
                        const message = 'An error occured while deleting existing verification record.';
                        res.redirect(`/user/verified/error=true&message=${message}`);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    const message = 'An error occured while updating user record to show verified.';
                    res.redirect(`/user/verified/error=true&message=${message}`);
                  });
              } else {
                const message = 'Invalid verification details. Check your email inbox again.';
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              console.log(error);
              const message = 'An error occured while comparing unique strings for verification record.';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        const message = "Account verification record doesn't exist or has been verified already. Please sign up or log in.";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      const message = 'An error occured while checking for existing verification record.';
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
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
