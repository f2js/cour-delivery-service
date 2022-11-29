const { Kafka } = require("kafkajs");
const { setOrderReadyForPickup } = require("../Controllers/deliveryController");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });
const producer = kafka.producer();

exports.KafkaOrder = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "OrderCreated", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());

      const addedOrder = await setOrderReadyForPickup(
        order.orderId,
        order.postalCode
      );

      if (addedOrder) {
        console.log("Order added to ready for pickup", addedOrder);
      } else {
        console.log("Order not added to ready for pickup");
      }
    },
  });
};
