const dbConnection = require("../Services/DBConnection");
const { ObjectId } = require("mongodb");
const { isValidObjectId } = require("mongoose");
const {
  OrderAcceptedEvent,
  OrderPickedUpEvent,
  OrderDeliveredEvent,
  OrderRejectedEvent,
} = require("../Services/KafkaOrdersProd");

exports.setOrderReadyForPickup = async (orderId, postalCode) => {
  const db = await dbConnection.get();

  const order = { orderId, postalCode };

  if ((await db.collection("orders").findOne({ orderId: orderId })) !== null) {
    res.status(400).send("Order already exists");
    return;
  }

  db.collection("orders").insertOne(order, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("RESULT ", result);
    }
  });
};

exports.getOrdersReadyForPickup = async (req, res) => {
  const db = await dbConnection.get();

  const { postalCode } = req.body;

  db.collection("orders")
    .find({ postalCode: postalCode })
    .toArray((err, orders) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(orders);
      }
    });
};

exports.acceptOrder = async (req, res) => {
  const db = await dbConnection.get();
  let userCollection = db.collection("users");
  let orderColection = db.collection("orders");

  const { orderId, courierId } = req.body;

  if (!isValidObjectId(courierId)) {
    res.status(400).send("Invalid courier id");
    return;
  }

  const courier = await userCollection.findOne({
    _id: ObjectId(courierId),
  });

  if (courier === null) {
    res.status(404).send("Courier not found");
    return;
  }

  if (courier.ordersAccepted.length >= 1) {
    res.status(400).send("Courier already has an order");
    return;
  }

  const order = await orderColection.findOne({
    orderId: orderId,
  });

  if (order === null) {
    res.status(404).send("Order not found");
    return;
  }

  if (courier.postalCode !== order.postalCode) {
    res.status(400).send("Courier and order are not in the same postal code");
    return;
  }

  userCollection.updateOne(
    { _id: ObjectId(courierId) },
    { $push: { ordersAccepted: orderId } },
    (err, result) => {
      if (err) {
        res.status(500);
      } else {
        orderColection.deleteOne({ orderId: orderId }, async (err, result) => {
          if (err) {
            res.status(500);
          } else {
            await OrderAcceptedEvent(orderId, courierId);
            res.status(200).send("Order accepted");
          }
        });
      }
    }
  );
};

exports.rejectOrder = async (req, res) => {
  const db = await dbConnection.get();
  let userCollection = db.collection("users");

  const { orderId, courierId } = req.body;

  if (!isValidObjectId(courierId)) {
    res.status(400).send("Invalid courier id");
    return;
  }

  const courier = await userCollection.findOne({
    _id: ObjectId(courierId),
    ordersAccepted: orderId,
  });

  if (courier === null) {
    res.status(404).send("Courier not found");
    return;
  }

  userCollection.updateOne(
    { _id: ObjectId(courierId) },
    { $pull: { ordersAccepted: orderId } },
    async (err, result) => {
      if (err) {
        res.status(500);
      } else {
        await OrderRejectedEvent(orderId);
        res.status(200).send("Order rejected");
      }
    }
  );
};

exports.orderPickedUp = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("courier");

  const { orderId } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $in: [orderId] },
  });
  if (courier) {
    await OrderPickedUpEvent(orderId);
    res(200).send("Order picked up");
  } else {
    return false; // no courier found
  }
};

exports.orderDelivered = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("courier");

  const { orderId } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $in: [orderId] },
  });
  if (courier) {
    await courierColelction.updateOne(
      { _id: ObjectId(courier._id) },
      { $pull: { ordersAccepted: orderId } }
    );

    await OrderDeliveredEvent(orderId);
    res(200).send("Order delivered");
  } else {
    return false; // no courier found
  }
};
