const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  orderDelivered,
  orderPickedUp,
  getOrdersReadyForPickup,
  acceptOrder,
  rejectOrder,
} = require("../Controllers/deliveryController");

router.route("/ordersReady").post(getOrdersReadyForPickup);
router.route("/ordersReady/accept").post(acceptOrder);

router.route("/orderPickedUp").post(orderPickedUp);
router.route("/orderDelivered").post(orderDelivered);
router.route("/orderRejected").post(rejectOrder);

module.exports = router;
