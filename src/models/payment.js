const mongoose = require("mongoose");
const User = require("./user");
const paymentSchema = new mongoose.Schema(
  {
    stripePaymentIntendId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "cad",
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    clientSecret: {
      type: String,
    },
    paymentMethodTypes: [{ type: String }],
    userId: {
      required: true,
      ref: "User",
      type: mongoose.Types.ObjectId
    },
  },

  { Timestamp: true }
);

module.exports = mongoose.model("Payments", paymentSchema);
