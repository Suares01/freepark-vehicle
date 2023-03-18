import express from 'express';
import cors from 'cors';
import vehiclesRoutes from './vehicles/vehicles.controller.js';
import usersRoutes from './users/users.controller.js'
import { connect } from './database/conn.js'
import { authentication } from './users/users.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(usersRoutes);
app.use(authentication);
app.use(vehiclesRoutes);

app.use((err, req, res, next) => {
  if (err.status === 401 && err.message === "You are not authenticated!") {
    res.status(err.status).send(err.message);
  } else {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
  }
});

connect((error) => {
  if (error) {
    console.error(error);
    process.exit();
  }

  app.listen(3000, () => console.log('Server is running on port http://localhost:3000'));
});
