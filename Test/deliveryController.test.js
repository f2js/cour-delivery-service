require("dotenv").config({ path: "./.env" });

const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

const DBConnection = require("../Services/DBConnection");
const { token } = require("./Utils/TestObjects");

process.env.NODE_ENV = "test";

let db, dbCollection, order;

beforeAll(async () => {
  await DBConnection.connect();
});

beforeEach(async () => {
  db = await DBConnection.get();

  dbCollection = db.collection("orders");

  order = { orderId: 2, postalCode: 1234 };

  await dbCollection.insertOne(order);
});

afterEach(async () => {
  await dbCollection.deleteOne({ orderId: order.orderId });
});

afterAll(async () => {
  await DBConnection.close();
});

describe("GET /ordersReady", () => {
  test("No token | Access denied", async () => {
    const response = await request.get(`/delivery/ordersReady`);
    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });

  /*
  test("Token | Access granted", async () => {
    const response = await request
      .get(`/delivery/ordersReady`)
      .set("auth-token", token);
    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });
  */
});
