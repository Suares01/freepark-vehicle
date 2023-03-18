import express from 'express';
import { park, getAllParkedVehicles, findByPlate, unpark } from './vehicles.service.js';
import { body, validationResult, check } from 'express-validator';

const router = express.Router();

router.get('/freepark-vehicles', async (req, res) => {
  const vehicles = await getAllParkedVehicles();

  vehicles.forEach((vehicle) => {
    delete vehicle._id
  });

  res.status(200).send(vehicles);
});

router.post(
  '/freepark-vehicles',
  body().notEmpty().withMessage('Body is required.'),
  body('placa').isString().notEmpty().withMessage('placa is required.'),
  body('marca').isString().notEmpty().withMessage('marca is required.'),
  body('modelo').isString().notEmpty().withMessage('Body is required.'),
  body('cor').isString().notEmpty().withMessage('Body is required.'),
  check('hora_entrada').isISO8601().toDate().withMessage('hora_entrada is required'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }

    const vehicle = {
      placa: req.body.placa,
      marca: req.body.marca,
      modelo: req.body.modelo,
      cor: req.body.cor,
      hora_entrada: req.body.hora_entrada
    };

    const isParked = await park(vehicle);

    if (isParked) {
      res.status(201).send();
    } else {
      res.status(400).send({
        msg: "Vehicle of that plate is already in freepark",
        param: "plate"
      });
    }
  });

router.get('/freepark-vehicles/:plateId', async (req, res) => {
  const plate = req.params.plateId;

  const vehicles = await findByPlate(plate);

  if (vehicles.length) {
    vehicles.forEach((vehicle) => {
      delete vehicle._id
    });

    res.status(200).send(vehicles);
  } else {
    res.status(404).send();
  }
});

router.patch(
  '/freepark-vehicles/:plateId',
  body().notEmpty().withMessage('Body is required.'),
  check('hora_saida').isISO8601().toDate().withMessage('hora_saida is required'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }

    const plate = req.params.plateId;
    const exitTime = req.body.hora_saida;

    const isUnparked = await unpark(plate, exitTime);

    if (isUnparked) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  });

export default router;
