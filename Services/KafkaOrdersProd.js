const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

exports.OrderAcceptedEvent = async (orderId, courierId) => {
  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "OrderAccepted",
    messages: [
      {
        value: JSON.stringify({
          orderId: orderId,
          courierId: courierId,
        }),
      },
    ],
  });
  await producer.disconnect();
};

exports.OrderRejectedEvent = async (orderId) => {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "OrderRejected",
    messages: [
      {
        value: JSON.stringify({
          orderId: orderId,
        }),
      },
    ],
  });
  await producer.disconnect();
};

exports.OrderPickedUpEvent = async (orderId) => {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "OrderPickedUp",
    messages: [
      {
        value: JSON.stringify({
          orderId: orderId,
        }),
      },
    ],
  });
  await producer.disconnect();
};

exports.OrderDeliveredEvent = async (orderId) => {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "OrderDelivered",
    messages: [
      {
        value: JSON.stringify({
          orderId: orderId,
        }),
      },
    ],
  });
  await producer.disconnect();
};
