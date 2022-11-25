const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

const app = express();
const KafkaOrder = require("./Services/KafkaConsumerProd");

app.use(bodyParser.json());
app.use(helmet());
app.use(xss());
app.use(cors());

const deliveryRouter = require("./Routes/deliveryRouter");
const {
  getOrdersReadyForDelivery,
} = require("./Controllers/deliveryController");

app.use("/delivery", deliveryRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" + req.originalUrl });
});

KafkaOrder();

module.exports = app;
