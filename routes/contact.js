const express = require("express");
const formController = require("../controllers/contact-form");
const paymentController = require("../controllers/payment");

const router = express.Router();

router.post("/contact-us", formController.contactForm);
router.post("/distance", formController.distanceMatrix);
router.put("/forgot-password", formController.forgotPassword);
router.put("/reset-password", formController.resetPassword);

router.post("/payment", paymentController.payment);

module.exports = router;
