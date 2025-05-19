const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const stripe = require("../utils/stripe");
const Payments = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const User = require("../models/user");

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
    // changing the payment status

    const paymentInfo = await Payments.findById(savedPayment._id)
    paymentInfo.status = "payment is done"
    console.log({paymentInfo});
    await paymentInfo.save();

    // changing the user to premium
    const specificUser = await User.findById(savedPayment.userId);
    specificUser.isPremium = true;
    await specificUser.save();


    res.send({
      ...savedPayment.toJSON(),
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = paymentRouter;
