module.exports = {
  Query: {
    getOrdersReadyForPickup: async (parent, { o_id }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.getOrdersReadyForPickup(o_id);
    },

    acceptOrder: async (parent, { o_id, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.acceptOrder(o_id, courierId);
    },

    rejectOrder: async (parent, { o_id, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.rejectOrder(o_id, courierId);
    },

    orderPickedUp: async (parent, { o_id, courierId }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.orderPickedUp(o_id, courierId);
    },

    orderDelivered: async (parent, { o_id }, { dataSources }) => {
      return dataSources.deliveryRESTAPI.orderDelivered(o_id);
    },
  },
};
