const dbConnection = require("../Services/DBConnection");
const { ObjectId } = require("mongodb");
const { isValidObjectId } = require("mongoose");
const {
  OrderAcceptedEvent,
  OrderPickedUpEvent,
  OrderDeliveredEvent,
  OrderRejectedEvent,
} = require("../Services/KafkaOrdersProd");

exports.setOrderReadyForPickup = async (order) => {
  const db = await dbConnection.get();

  const { o_id } = order;

  if ((await db.collection("orders").findOne({ o_id: o_id })) !== null) {
    console.log("Order already exists");
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
        res.status(500).send({ err });
      } else {
        res.status(200).json({ orders });
      }
    });
};

exports.acceptOrder = async (req, res) => {
  const db = await dbConnection.get();
  let userCollection = db.collection("users");
  let orderColection = db.collection("orders");

  const { o_id, courierId } = req.body;

  if (!isValidObjectId(courierId)) {
    res.status(400).send({ message: "Invalid courier id" });
    return;
  }

  const courier = await userCollection.findOne({
    _id: ObjectId(courierId),
  });

  if (courier === null) {
    res.status(404).send({ message: "Courier not found" });
    return;
  }

  if (courier.ordersAccepted.length >= 1) {
    res.status(400).send({ message: "Courier already has an order" });
    return;
  }

  const order = await orderColection.findOne({
    o_id: o_id,
  });

  if (order === null) {
    res.status(404).send({ message: "Order not found" });
    return;
  }

  if (courier.postalCode !== order.postalCode) {
    res
      .status(400)
      .send({ message: "Courier and order are not in the same postal code" });
    return;
  }

  userCollection.updateOne(
    { _id: ObjectId(courierId) },
    { $push: { ordersAccepted: order } },
    (err, result) => {
      if (err) {
        res.status(500);
      } else {
        orderColection.deleteOne({ o_id: o_id }, async (err, result) => {
          if (err) {
            res.status(500);
          } else {
            await OrderAcceptedEvent(o_id, courierId);
            res.status(200).send({ message: "Order accepted" });
          }
        });
      }
    }
  );
};

exports.rejectOrder = async (req, res) => {
  const db = await dbConnection.get();
  let userCollection = db.collection("users");

  const { o_id, courierId } = req.body;

  if (!isValidObjectId(courierId)) {
    res.status(400).send({ message: "Invalid courier id" });
    return;
  }

  const courier = await userCollection.findOne({
    _id: ObjectId(courierId),
  });

  if (courier === null) {
    res.status(404).send({ message: "Courier not found" });
  }

  userCollection.updateOne(
    { _id: ObjectId(courierId) },
    { $pull: { ordersAccepted: { o_id: o_id } } },
    async (err, result) => {
      if (err) {
        res.status(500);
      } else {
        await OrderRejectedEvent(o_id, courierId);
        res.status(200).send({ message: "Order rejected" });
      }
    }
  );
};

exports.orderPickedUp = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("users");

  const { o_id, courierId } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $elemMatch: { o_id: o_id } },
  });

  if (courier) {
    await OrderPickedUpEvent(o_id, courierId);
    return res.status(200).send({ message: "Order picked up" });
  } else {
    return res.status(404).send({ message: "Courier not found" });
  }
};

exports.orderDelivered = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("users");

  const { o_id } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $elemMatch: { o_id: o_id } },
  });

  if (courier === null) {
    return res.status(404).send({ message: "Courier not found" });
  }

  await courierColelction.updateOne(
    { _id: ObjectId(courier._id) },
    { $pull: { ordersAccepted: { o_id: o_id } } }
  );

  await OrderDeliveredEvent(o_id);
  res.status(200).send({ message: "Order delivered" });
};
