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

  console.log("ORDER ", order);
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

  const { o_id } = req.body;

  db.collection("orders")
    .find({ o_id: o_id })
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

  const { orderId, courierId } = req.body;

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
    orderId: orderId,
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
        orderColection.deleteOne({ orderId: orderId }, async (err, result) => {
          if (err) {
            res.status(500);
          } else {
            await OrderAcceptedEvent(orderId, courierId);
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

  const { orderId, courierId } = req.body;

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
    { $pull: { ordersAccepted: { orderId: orderId } } },
    async (err, result) => {
      if (err) {
        res.status(500);
      } else {
        await OrderRejectedEvent(orderId, courierId);
        res.status(200).send({ message: "Order rejected" });
      }
    }
  );
};

exports.orderPickedUp = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("users");

  const { orderId, courierId } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $elemMatch: { orderId: orderId } },
  });

  if (courier) {
    await OrderPickedUpEvent(orderId, courierId);
    return res.status(200).send({ message: "Order picked up" });
  } else {
    return res.status(404).send({ message: "Courier not found" });
  }
};

exports.orderDelivered = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("users");

  const { orderId } = req.body;

  let courier = await courierColelction.findOne({
    ordersAccepted: { $elemMatch: { orderId: orderId } },
  });

  if (courier) {
    await courierColelction.updateOne(
      { _id: ObjectId(courier._id) },
      { $pull: { ordersAccepted: { orderId: orderId } } }
    );

    await OrderDeliveredEvent(orderId);
    res.status(200).send({ message: "Order delivered" });
  } else {
    res.status(404).send({ message: "Courier not found" });
  }
};
