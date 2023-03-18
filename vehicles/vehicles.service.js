import { db } from '../database/conn.js';

const collection = db().collection("vehicles");

async function getAllParkedVehicles() {
  const vehicles = await collection.find().toArray();

  return vehicles;
}

async function findByPlate(plate) {
  const vehicle = await collection.find({ placa: plate }).toArray();

  return vehicle;
}

async function park(vehicle) {
  const vehicleAlreadyParked = await collection.findOne({ placa: vehicle.placa, status: "estacionado" });

  if (vehicleAlreadyParked) {
    return false;
  } else {
    const newVehicle = {
      ...vehicle,
      status: "estacionado",
    };

    await collection.insertOne(newVehicle);

    return true;
  }
}

async function unpark(plate, exitTime) {
  const vehicle = await collection.findOne({ placa: plate });

  if (vehicle) {
    await collection.updateOne({ placa: plate }, { $set: { hora_saida: exitTime, status: "saida_estacionamento" } });

    return true;
  } else {
    return false;
  }
}

export { getAllParkedVehicles, park, findByPlate, unpark };
