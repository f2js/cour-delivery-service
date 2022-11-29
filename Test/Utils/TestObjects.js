require("dotenv").config({ path: "./.env" });
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const user1 = {
  _id: ObjectId("63792d5816f351eb710ecd2c"),
  name: "Freddy Krueger",
  username: "realslimfreddy",
  email: "freddy@freddy.com",
  password: "blablabla",
  role: "user",
};

const user2 = {
  _id: ObjectId("63792d5818f351eb710ecd2c"),
  name: "Frederik Dahl",
  username: "realslimtestuser",
  email: "freddy@freddy.com",
  password: "blablabla",
  role: "user",
};

let secret = process.env.TOKEN_SECRET;
const token = jwt.sign({ user1 }, secret);

module.exports = { user1, user2, token };
