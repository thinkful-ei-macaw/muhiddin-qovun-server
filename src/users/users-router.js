const { requireAuth } = require('../middleware/jwt-auth');

const express = require('express');
const path = require('path');
const UsersService = require('./users-service');


const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, email } = req.body;

    for (const field of ['full_name', 'user_name', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    // TODO: check user_name doesn't start with spaces
    const usernameError = UsersService.validateUsername(user_name);
    const passwordError = UsersService.validatePassword(password);

    if (usernameError)
      return res.status(400).json({ error: usernameError });
    
    if (passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: 'Username already taken' });

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              email,
              date_created: 'now()',
            };

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

usersRouter
  .get('/name', requireAuth, (req, res, next) => {
    const { full_name } = req.user;
    res.json({ full_name });
  })
  .get('/user_id', requireAuth, (req, res, next) => {
    const { user_id } = req.user;
    res.json({ user_id });
  });
  

module.exports = usersRouter;