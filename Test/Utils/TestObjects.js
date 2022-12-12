const { ObjectId } = require("mongodb");

const user1 = {
  _id: ObjectId("63792d5816f351eb710ecd2c"),
  name: "Freddy Krueger",
  postalCode: 4000,
  ordersAccepted: [],
};

const user2 = {
  _id: ObjectId("63792d5816f351eb710ecd3d"),
  name: "Test person",
  postalCode: 3000,
  ordersAccepted: [],
};

const user3 = {
  _id: ObjectId("63792d5816f351eb710ecd4e"),
  name: "Test person 2",
  postalCode: 3000,
  ordersAccepted: [3],
};

const user4 = {
  _id: ObjectId("63792d5816f351eb710ecd5f"),
  name: "Test person 3",
  postalCode: 3000,
  ordersAccepted: [],
};

order1 = { o_id: 2, postalCode: 4000 };

order2 = { o_id: 3, postalCode: 3000 };

module.exports = { user1, user2, user3, user4, order1, order2 };
