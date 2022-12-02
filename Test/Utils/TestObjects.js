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

order1 = { orderId: 2, postalCode: 4000 };

order2 = { orderId: 3, postalCode: 3000 };

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyMSI6eyJfaWQiOiI2Mzc5MmQ1ODE2ZjM1MWViNzEwZWNkMmMiLCJuYW1lIjoiRnJlZGR5IEtydWVnZXIiLCJ1c2VybmFtZSI6InJlYWxzbGltZnJlZGR5IiwiZW1haWwiOiJmcmVkZHlAZnJlZGR5LmNvbSIsInBhc3N3b3JkIjoiYmxhYmxhYmxhIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjY5NzQ1OTk2fQ.VWqAMckqi-42ed_R6RWXEQ0OIEmZXNtMbPKFAGARy4Y";

module.exports = { user1, user2, user3, user4, token, order1, order2 };
