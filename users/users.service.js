import { db } from '../database/conn.js';
import * as bcrypt from 'bcrypt';

const collection = db().collection("users");

async function register(data) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const newUser = {
    username: data.username,
    password: passwordHash,
  };

  await collection.insertOne(newUser);
}

async function validate(username, password) {
  const user = await collection.findOne({ username });
  
  if (!user) {
    return false
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return false
  }

  return true;
}

export { validate, register };
