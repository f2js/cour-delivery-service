const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  orderDelivered,
  orderPickedUp,
  getOrdersReadyForPickup,
  acceptOrder,
  rejectOrder,
  getAllUsers,
} = require("../Controllers/deliveryController");
const JWTverify = require("../Middleware/verifyToken");

const USE_AUTH = !process.env["SKIP_AUTH"];
/*
if (USE_AUTH) {
  router.use(JWTverify);
}*/

router.route("/ordersReady").post(getOrdersReadyForPickup);
router.route("/ordersReady/accept").post(acceptOrder);

router.route("/orderPickedUp").post(orderPickedUp);
router.route("/orderDelivered").post(orderDelivered);
router.route("/orderRejected").post(rejectOrder);
router.route("/allUsers").get(getAllUsers);

module.exports = router;
