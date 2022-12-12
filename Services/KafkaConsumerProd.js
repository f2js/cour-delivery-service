const { Kafka } = require("kafkajs");
const { setOrderReadyForPickup } = require("../Controllers/deliveryController");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER],
});

exports.KafkaOrder = async () => {
  // Consuming
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "OrderCreated", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());

      const addedOrder = await setOrderReadyForPickup(order);

      if (addedOrder) {
        console.log("Order added to ready for pickup", addedOrder);
      } else {
        console.log("Order not added to ready for pickup");
      }
    },
  });
};
