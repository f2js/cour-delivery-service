module.exports = {
  Query: {
    getOrdersReadyForPickup: async (
      parent,
      { postalCode },
      { dataSources }
    ) => {
      return dataSources.deliveryRESTAPI.getOrdersReadyForPickup(postalCode);
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
