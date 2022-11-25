const dbConnection = require("../Services/DBConnection");
const { ObjectId } = require("mongodb");
const { isValidObjectId } = require("mongoose");
const { Kafka } = require("kafkajs");

const courier = { courierId: "", name: "", postalCode: "", ordersAccepted: [] };

exports.getOrdersReadyForDelivery = async (orderId, postalCode) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("courier");

  let courier = await courierColelction.findOne({
    postalCode: postalCode,
    ordersAccepted: { $size: 0 },
  });
  if (courier) {
    await courierColelction.updateOne(
      { _id: ObjectId(courier._id) },
      { $push: { ordersAccepted: orderId } }
    );
    return courier._id;
  } else {
    return null; // no courier found
  }
};

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

exports.orderPickedUp = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("courier");

  let orderId = req.body.orderId;

  // find courier with orderId in ordersAccepted
  let courier = await courierColelction.findOne({
    ordersAccepted: { $in: [orderId] },
  });
  if (courier) {
    // if there is a courier raise event OrderPickedUp
    await producer.connect();
    await producer.send({
      topic: "OrderPickedUp",
      messages: [
        {
          value: JSON.stringify({
            orderId: orderId,
            courierId: courier._id,
          }),
        },
      ],
    });
    await producer.disconnect();
  } else {
    return false; // no courier found
  }
};

exports.orderDelivered = async (req, res) => {
  let db = await dbConnection.get();
  let courierColelction = db.collection("courier");

  let orderId = req.body.orderId;

  // find courier with orderId in ordersAccepted
  let courier = await courierColelction.findOne({
    ordersAccepted: { $in: [orderId] },
  });
  if (courier) {
    // remove orderId from ordersAccepted
    await courierColelction.updateOne(
      { _id: ObjectId(courier._id) },
      { $pull: { ordersAccepted: orderId } }
    );

    console.log("deleted the order", orderId, "from the courier", courier._id);

    await producer.connect();
    await producer.send({
      topic: "OrderDelivered",
      messages: [
        {
          value: JSON.stringify({
            orderId: orderId,
            courierId: courier._id,
          }),
        },
      ],
    });
    await producer.disconnect();
  } else {
    return false; // no courier found
  }
};
