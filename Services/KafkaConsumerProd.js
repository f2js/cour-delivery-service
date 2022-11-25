const { Kafka } = require("kafkajs");
const {
  getOrdersReadyForDelivery,
} = require("../Controllers/deliveryController");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });
const producer = kafka.producer();

const KafkaOrder = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "OrderCreated", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      const courierId = await getOrdersReadyForDelivery(
        order.orderId,
        order.postalCode
      );

      if (courierId) {
        console.log(`Order ${order.orderId} assigned to courier ${courierId}`);
        // publish to kafka
        await producer.connect();
        await producer.send({
          topic: "OrderAssigned",
          messages: [
            {
              value: JSON.stringify({
                orderId: order.orderId,
                courierId: courierId,
              }),
            },
          ],
        });

        await producer.disconnect();
      } else {
        console.log(`No courier available for order ${order.orderId}`);
      }
    },
  });
};

module.exports = KafkaOrder;
