const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const stripe = require("../utils/stripe");
const Payments = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "cad",
    });

    // save it in my database
    // return back order details to FE
    console.log(paymentIntent);


    const payment = new Payments({
      stripePaymentIntendId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      userId: req.user._id,
      type: membershipType,
    });

    const savedPayment = await payment.save();
    res.send({
      ...savedPayment.toJSON(),
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = paymentRouter;
