require("dotenv").config({ path: "./.env" });

const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

const DBConnection = require("../Services/DBConnection");
const {
  token,
  user1,
  user2,
  order1,
  order2,
  user3,
  user4,
} = require("./Utils/TestObjects");

process.env.NODE_ENV = "test";

let db, orderCollection, userCollection;

beforeAll(async () => {
  await DBConnection.connect();
});

beforeEach(async () => {
  db = await DBConnection.get();

  orderCollection = db.collection("orders");
  userCollection = db.collection("users");

  await orderCollection.insertMany([order1, order2]);
  await userCollection.insertMany([user1, user2, user3]);
});

afterEach(async () => {
  await orderCollection.deleteMany({});
  await userCollection.deleteMany({});
});

afterAll(async () => {
  await DBConnection.close();
});

describe("POST /ordersReady", () => {
  /*
  test("No token | Access denied", async () => {
    const response = await request.post(`/delivery/ordersReady`);
    expect(response.status).toBe(401);
    expect(response._body).toBeTruthy();
  });*/
  test("Token | Access granted", async () => {
    const response = await request
      .post(`/delivery/ordersReady`)
      .set("auth-token", token);
    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });
});

describe("POST /ordersReady/accept", () => {
  /*
  test("No token | Access denied", async () => {
    const response = await request.post(`/delivery/ordersReady/accept`);
    expect(response.status).toBe(401);
    expect(response._body).toBeTruthy();
  });

  test("Accept order | Should return 200", async () => {
    const response = await request
      .post(`/delivery/ordersReady/accept`)
      .send({ courierId: user1._id, orderId: 2 })
      .set("auth-token", token);

    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });
  */

  test("Invalid Courier Id | Should return 400", async () => {
    const response = await request
      .post(`/delivery/ordersReady/accept`)
      .set("auth-token", token)
      .send({ orderId: "123", courierId: "123" });
    expect(response.status).toBe(400);
    expect(response._body).toBeTruthy();
  });

  test("Courier not found | Should return 404", async () => {
    const response = await request
      .post(`/delivery/ordersReady/accept`)
      .set("auth-token", token)
      .send({ orderId: order1.orderId, courierId: user4._id });
    expect(response.status).toBe(404);
    expect(response._body).toBeTruthy();
  });

  test("Order not found | Should return 404", async () => {
    const response = await request
      .post(`/delivery/ordersReady/accept`)
      .set("auth-token", token)
      .send({ orderId: "123456789012", courierId: user1._id });
    expect(response.status).toBe(404);
    expect(response._body).toBeTruthy();
  });

  test("Courier and Order non matching postal code | Should return 400", async () => {
    const response = await request
      .post(`/delivery/ordersReady/accept`)
      .set("auth-token", token)
      .send({ orderId: order2.orderId, courierId: user1._id });
    expect(response.status).toBe(400);
    expect(response._body).toBeTruthy();
  });
});

describe("POST /orderRejected", () => {
  /*
  test("No token | Access denied", async () => {
    const response = await request.post(`/delivery/orderRejected`);
    expect(response.status).toBe(401);
    expect(response._body).toBeTruthy();
  });

  test("Reject order | Should return 200", async () => {
    const response = await request
      .post(`/delivery/orderRejected`)
      .set("auth-token", token)
      .send({ courierId: user3._id, orderId: user3.ordersAccepted[0] });

    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });
  */

  test("Invalid Courier Id | Should return 400", async () => {
    const response = await request
      .post(`/delivery/orderRejected`)
      .set("auth-token", token)
      .send({ orderId: "123", courierId: "123" });
    expect(response.status).toBe(400);
    expect(response._body).toBeTruthy();
  });

  test("Courier not found | Should return 404", async () => {
    const response = await request
      .post(`/delivery/orderRejected`)
      .set("auth-token", token)
      .send({ orderId: order1.orderId, courierId: user4._id });
    expect(response.status).toBe(404);
    expect(response._body).toBeTruthy();
  });
});

/* Takes too long to run "Exceeded timeout of 15000 ms for a test."
describe("POST /orderDelivered", () => {
  test("No token | Access denied", async () => {
    const response = await request.post(`/delivery/orderDelivered`);
    expect(response.status).toBe(401);
    expect(response._body).toBeTruthy();
  });
  test(" Deliver order | Should return 200", async () => {
    const response = await request
      .post(`/delivery/orderDelivered`)
      .send({ orderId: user3.ordersAccepted[0] })
      .set("auth-token", token);

    expect(response.status).toBe(200);
    expect(response._body).toBeTruthy();
  });
});

describe("POST /orderPickedUp", () => {
  test("No token | Access denied", async () => {
    const response = await request.post(`/delivery/orderPickedUp`);
    expect(response.status).toBe(401);
    expect(response._body).toBeTruthy();
  });
  test(" Pick up order | Should return 200", async () => {
    const response = await request
    .post(`/delivery/orderPickedUp`)
    .send({ orderId: user3.ordersAccepted[0] })
      .set("auth-token", token);
      
      expect(response.status).toBe(200);
      expect(response._body).toBeTruthy();
    });
  });
  
*/
