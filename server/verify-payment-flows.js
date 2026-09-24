/**
 * Offline verification for the eSewa payment flow (no network, no database):
 *   node verify-payment-flows.js
 *
 * Covers what the server enforces in controllers/shop/order-controller.js:
 * form signing, mock COMPLETE payload, base64 decode, HMAC signature,
 * order-uuid binding, amount match, and tamper rejection.
 *
 * The old PayPal version of this file was truncated (SyntaxError:
 * Unexpected end of input) and referenced helpers/paypal + capturePayment,
 * which no longer exist since the migration to eSewa (see helpers/esewa.js).
 */

// Force deterministic test credentials before helpers/esewa.js is loaded.
process.env.ESEWA_MODE = process.env.ESEWA_MODE || "mock";
process.env.ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
process.env.ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

const {
  buildEsewaPaymentForm,
  buildMockSuccessPayload,
  decodeEsewaResponse,
  isValidEsewaSignature,
  formatEsewaAmount,
} = require("./helpers/esewa");

const check = (name, condition, detail = "") => {
  console.log(
    `${condition ? "PASS" : "FAIL"} :: ${name}${detail ? ` [${detail}]` : ""}`
  );
  if (!condition) process.exitCode = 1;
};

const fakeOrderId = "64f000000000000000000001"; // 24-hex like a Mongo ObjectId
const totalAmount = 200;
const productCode = process.env.ESEWA_MERCHANT_CODE;

// 1. Amount formatting is canonical (server total vs eSewa string)
check("amount 200 formats to '200'", formatEsewaAmount(200) === "200");
check(
  "amount 199.9 formats to '199.9'",
  formatEsewaAmount(199.9) === "199.9"
);
check("negative amount is rejected", formatEsewaAmount(-5) === null);
check("non-numeric amount is rejected", formatEsewaAmount("abc") === null);

// 2. Payment form is signed over total_amount,transaction_uuid,product_code
const form = buildEsewaPaymentForm({
  totalAmount,
  orderId: fakeOrderId,
});
check(
  "form carries the order id as transaction_uuid",
  form.esewaParams.transaction_uuid === fakeOrderId,
  form.esewaParams.transaction_uuid
);
check(
  "form signature verifies",
  isValidEsewaSignature(form.esewaParams) === true
);

// 3. Mock gateway payload decodes and verifies like a real eSewa response
const data = buildMockSuccessPayload({
  orderId: fakeOrderId,
  totalAmount,
  productCode,
});
const payload = decodeEsewaResponse(data);
check("mock payload decodes", Boolean(payload), String(data).slice(0, 40));
check(
  "mock payload status is COMPLETE",
  payload && payload.status === "COMPLETE",
  payload && payload.status
);
check(
  "mock payload signature verifies",
  isValidEsewaSignature(payload) === true
);
check(
  "mock payload is bound to this order",
  String(payload && payload.transaction_uuid) === String(fakeOrderId)
);
check(
  "mock payload amount matches the server total",
  formatEsewaAmount(Number(payload && payload.total_amount)) ===
    formatEsewaAmount(totalAmount),
  payload && payload.total_amount
);

// 4. Tampering is rejected (amount changed after signing)
const tampered = { ...payload, total_amount: "1" };
check(
  "tampered amount fails signature",
  isValidEsewaSignature(tampered) === false
);

// 5. A payload for another order is rejected by uuid binding
const otherData = buildMockSuccessPayload({
  orderId: "64f000000000000000000002",
  totalAmount,
  productCode,
});
const otherPayload = decodeEsewaResponse(otherData);
check(
  "payload for another order does not match this order",
  String(otherPayload.transaction_uuid) !== String(fakeOrderId)
);

// 6. Garbage input decodes to null (controller returns 400, never confirms)
check("garbage base64 decodes to null", decodeEsewaResponse("!!!") === null);
check("empty data decodes to null", decodeEsewaResponse("") === null);

console.log(
  process.exitCode ? "\nRESULT: FAIL" : "\nRESULT: ALL CHECKS PASSED"
);
