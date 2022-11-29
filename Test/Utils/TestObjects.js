const { ObjectId } = require("mongodb");

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

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyMSI6eyJfaWQiOiI2Mzc5MmQ1ODE2ZjM1MWViNzEwZWNkMmMiLCJuYW1lIjoiRnJlZGR5IEtydWVnZXIiLCJ1c2VybmFtZSI6InJlYWxzbGltZnJlZGR5IiwiZW1haWwiOiJmcmVkZHlAZnJlZGR5LmNvbSIsInBhc3N3b3JkIjoiYmxhYmxhYmxhIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjY5NzQ1OTk2fQ.VWqAMckqi-42ed_R6RWXEQ0OIEmZXNtMbPKFAGARy4Y";

module.exports = { user1, user2, token };
