const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const stripe = require("../utils/stripe");
const Payments = require("../models/payment");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4000,
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
    });

    const savedPayment = await payment.save();
    res.send({
      ...savedPayment.toJSON(),
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = paymentRouter;
