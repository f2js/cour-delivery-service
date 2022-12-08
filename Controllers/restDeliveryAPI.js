const { RESTDataSource } = require("@apollo/datasource-rest");

class DeliveryRESTAPI extends RESTDataSource {
  baseURL = "http://localhost:3000/delivery/";

  mapResults(obj) {
    if (obj) {
      obj.id = obj._id.toString();
    }
    return obj;
  }

  async getAllUsers() {
    const { users } = await this.get("allUsers");
    return users.map((user) => this.mapResults(user));
  }

  async getOrdersReadyForPickup(o_id) {
    const { orders } = await this.post("ordersReady", { body: { o_id } });
    return orders.map((order) => this.mapResults(order));
  }

  async acceptOrder(orderId, courierId) {
    const { message } = await this.post("ordersReady/accept", {
      body: { orderId, courierId },
    });
    return message;
  }

  async rejectOrder(orderId, courierId) {
    const { message } = await this.post("orderRejected", {
      body: { orderId, courierId },
    });
    return message;
  }

  async orderPickedUp(orderId) {
    const { message } = await this.post("orderPickedUp", {
      body: { orderId },
    });

    return message;
  }

  async orderDelivered(orderId) {
    const { message } = await this.post("orderDelivered", {
      body: { orderId },
    });

    return message;
  }
}

module.exports = DeliveryRESTAPI;
