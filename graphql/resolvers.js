module.exports = {
  Query: {
    getOrdersReadyForPickup: async (parent, { o_id }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.getOrdersReadyForPickup(o_id);
    },

    acceptOrder: async (parent, { orderId, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.acceptOrder(orderId, courierId);
    },

    rejectOrder: async (parent, { orderId, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.rejectOrder(orderId, courierId);
    },

    orderPickedUp: async (parent, { orderId, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.orderPickedUp(orderId, courierId);
    },

    orderDelivered: async (parent, { orderId, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.orderDelivered(orderId, courierId);
    },
  },
};
