const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  orderDelivered,
  orderPickedUp,
} = require("../Controllers/deliveryController");

router.route("/orderPickedUp").post(orderPickedUp);
router.route("/orderDelivered").post(orderDelivered);

module.exports = router;
