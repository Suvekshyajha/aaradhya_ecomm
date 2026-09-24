const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number, // unit price recalculated by the server (see helpers/order.js)
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  // Payment / transaction information. Everything here is written from what
  // eSewa verified server side (see helpers/esewa.js) or from the server itself.
  paymentId: String, // eSewa transaction_uuid (= the order id)
  payerId: String, // unused for eSewa (kept for schema compatibility)
  transactionId: String, // eSewa transaction_code
  transactionState: String, // e.g. "COMPLETE"
  paymentCurrency: String, // currency eSewa charged in, always "NPR"
  paidAmount: Number, // amount eSewa really captured
  paymentPayerEmail: String, // unused for eSewa (kept for schema compatibility)
  paymentDate: Date, // when the server verified the payment
  paymentFailureReason: String, // why a payment failed / was cancelled
  // Stock bookkeeping (see helpers/order.js). Both stay undefined for orders that
  // never captured a payment, so a cancellation knows whether it must restock.
  //   stockDecremented -> the units of this order were taken out of the stock
  //   stockRestored    -> those units were already given back (cancelled order)
  stockDecremented: Boolean,
  stockRestored: Boolean,
});

module.exports = mongoose.model("Order", OrderSchema);