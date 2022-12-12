const { RESTDataSource } = require("@apollo/datasource-rest");

class DeliveryRESTAPI extends RESTDataSource {
  baseURL = "http://localhost:3000/delivery/";

  mapResults(obj) {
    if (obj) {
      obj.id = obj._id.toString();
    }
    return obj;
  }

  async getOrdersReadyForPickup(o_id) {
    const { orders } = await this.post("ordersReady", { body: { o_id } });
    return orders.map((order) => this.mapResults(order));
  }

  async acceptOrder(o_id, courierId) {
    const { message } = await this.post("ordersReady/accept", {
      body: { o_id, courierId },
    });
    return message;
  }

  async rejectOrder(o_id, courierId) {
    const { message } = await this.post("orderRejected", {
      body: { o_id, courierId },
    });
    return message;
  }

  async orderPickedUp(o_id) {
    const { message } = await this.post("orderPickedUp", {
      body: { o_id },
    });

    return message;
  }

  async orderDelivered(o_id) {
    const { message } = await this.post("orderDelivered", {
      body: { o_id },
    });

    return message;
  }
}

module.exports = DeliveryRESTAPI;
