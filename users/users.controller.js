import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, validate } from './users.service.js';

const router = express.Router();

function msgNotAuthenticated() {
  var err = new Error("You are not authenticated!");
  err.status = 401;
  return err;
}

export async function authentication(req, res, next) {
  const authheader = req.headers.authorization;

  if (!authheader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return next(msgNotAuthenticated());
  }

  const auth = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const username = auth[0];
  const password = auth[1];

  const isValidUser = await validate(username, password);

  if (isValidUser) {
    next();
  } else {
    res.setHeader("WWW-Authenticate", "Basic");
    return next(msgNotAuthenticated());
  }
}

router.post(
  '/users',
  body('username').isString().notEmpty().withMessage('username is required'),
  body('password').isString().notEmpty().withMessage('password is required'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }

    const data = req.body;

    await register(data);

    res.status(201).send();
  }
);

export default router;
