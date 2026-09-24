const crypto = require("crypto");

// eSewa ePay v2 configuration. Credentials come from server/.env:
//   ESEWA_MODE=test            -> UAT endpoints (default)
//   ESEWA_MODE=live            -> production endpoints
//   ESEWA_MODE=mock            -> built-in test gateway (no eSewa network
//                                 calls at all; all local signature/amount/
//                                 ownership checks stay enforced)
//   ESEWA_MERCHANT_CODE        -> eSewa merchant code (defaults to the
//                                 public UAT code EPAYTEST in test mode)
//   ESEWA_SECRET_KEY           -> secret used for the HMAC-SHA256 signature
//                                 (defaults to eSewa's published UAT secret
//                                 in test mode; MUST be replaced in live mode)
const ESEWA_MODE = (process.env.ESEWA_MODE || "test").toLowerCase();
const IS_LIVE = ESEWA_MODE === "live";
const IS_MOCK = ESEWA_MODE === "mock";

const ESEWA_FORM_URL =
  process.env.ESEWA_FORM_URL ||
  (IS_LIVE
    ? "https://epay.esewa.com.np/api/epay/main/v2/form"
    : "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

const ESEWA_STATUS_URL =
  process.env.ESEWA_STATUS_URL ||
  (IS_LIVE
    ? "https://epay.esewa.com.np/api/epay/transaction/status/"
    : "https://rc-epay.esewa.com.np/api/epay/transaction/status/");

const ESEWA_MERCHANT_CODE =
  process.env.ESEWA_MERCHANT_CODE || (IS_LIVE ? "" : "EPAYTEST");
const ESEWA_SECRET_KEY =
  process.env.ESEWA_SECRET_KEY || (IS_LIVE ? "" : "8gBm/:&EnhH.1/q");

// eSewa only processes NPR
const ESEWA_CURRENCY = "NPR";

// Fields covered by the HMAC signature, in this exact order
const SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code";

if (!ESEWA_MERCHANT_CODE || !ESEWA_SECRET_KEY) {
  console.warn(
    "[esewa] ESEWA_MERCHANT_CODE / ESEWA_SECRET_KEY are not set - eSewa checkout will fail. See server/.env.example."
  );
}

const CLIENT_URL = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/+$/, "");

// eSewa compares amounts as plain strings, so one canonical format is used
// both when signing the payment form and when verifying the result
const formatEsewaAmount = (value) => {
  const rounded = Math.round(Number(value) * 100) / 100;
  if (!Number.isFinite(rounded) || rounded < 0) return null;
  return String(rounded);
};

const getEsewaReturnUrls = (orderId) => ({
  success_url: `${CLIENT_URL}/shop/esewa-success?orderId=${orderId}`,
  failure_url: `${CLIENT_URL}/shop/esewa-failure?orderId=${orderId}`,
});

// Builds the signed form fields the browser posts to eSewa. The
// transaction_uuid is the order id, so eSewa's response can only ever
// confirm the exact order the server created. In mock mode the "gateway"
// is the app's own test cashier page - no real URL is ever called.
const buildEsewaPaymentForm = ({ totalAmount, orderId }) => {
  const total_amount = formatEsewaAmount(totalAmount);

  if (total_amount === null) {
    throw new Error("Invalid order total for eSewa payment");
  }

  const transaction_uuid = String(orderId);
  const product_code = ESEWA_MERCHANT_CODE;

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");

  const { success_url, failure_url } = getEsewaReturnUrls(orderId);

  return {
    esewaUrl: IS_MOCK
      ? `${CLIENT_URL}/shop/mock-gateway?orderId=${transaction_uuid}`
      : ESEWA_FORM_URL,
    mockMode: IS_MOCK,
    esewaParams: {
      amount: total_amount,
      tax_amount: "0",
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url,
      failure_url,
      signed_field_names: SIGNED_FIELD_NAMES,
      signature,
    },
  };
};

// Builds a genuinely-signed COMPLETE response payload for mock mode, shaped
// exactly like eSewa's own success response. The normal verify path checks
// it (signature, uuid binding, amount), so mock payments exercise the same
// security checks as real ones.
const buildMockSuccessPayload = ({ orderId, totalAmount, productCode }) => {
  const total_amount = formatEsewaAmount(totalAmount);
  const transaction_uuid = String(orderId);
  const signed_field_names = "transaction_code,status,total_amount,transaction_uuid,product_code";
  const transaction_code = `MOCK${Date.now().toString(36).toUpperCase()}`;
  const status = "COMPLETE";

  const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
  const signature = crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");

  return Buffer.from(
    JSON.stringify({
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code: productCode,
      signed_field_names,
      signature,
    })
  ).toString("base64");
};

// Decodes the base64 `data` eSewa appends to the success_url. Returns the
// payload object or null when it is missing/malformed.
const decodeEsewaResponse = (data) => {
  if (!data || typeof data !== "string") return null;
  try {
    return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
  } catch {
    return null;
  }
};

// Recomputes the HMAC signature over the response's own signed fields.
// Whatever the browser posted is never trusted - the signature must match
// what only the holder of the secret key could have produced.
const isValidEsewaSignature = (payload) => {
  if (!payload || typeof payload !== "object") return false;

  const signedFieldNames = payload.signed_field_names;
  if (typeof signedFieldNames !== "string" || !signedFieldNames) return false;

  const message = signedFieldNames
    .split(",")
    .map((name) => `${name}=${payload[name] ?? ""}`)
    .join(",");

  const expected = crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");

  const actual = payload.signature;
  if (typeof actual !== "string" || !actual) return false;

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(actual);
  return (
    expectedBuf.length === actualBuf.length &&
    crypto.timingSafeEqual(expectedBuf, actualBuf)
  );
};

const getEsewaErrorMessage = (error) =>
  error?.message || "Unknown eSewa error";

// Independent server-side verification: the server asks eSewa itself whether
// this transaction really completed for this product code / amount / uuid.
// In mock mode there is no eSewa to ask, so the stub confirms whatever the
// (signature-verified) payload claims - every local check still runs.
const checkEsewaTransactionStatus = async ({ productCode, totalAmount, transactionUuid }) => {
  if (IS_MOCK) {
    return {
      status: "COMPLETE",
      transaction_code: `MOCK${String(transactionUuid).slice(-6).toUpperCase()}`,
      total_amount: totalAmount,
      product_code: productCode,
    };
  }

  const params = new URLSearchParams({
    product_code: productCode,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
  });

  const response = await fetch(`${ESEWA_STATUS_URL}?${params.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`eSewa status check failed with HTTP ${response.status}`);
  }

  return response.json();
};

module.exports = {
  ESEWA_CURRENCY,
  ESEWA_MERCHANT_CODE,
  IS_MOCK,
  formatEsewaAmount,
  buildEsewaPaymentForm,
  buildMockSuccessPayload,
  decodeEsewaResponse,
  isValidEsewaSignature,
  checkEsewaTransactionStatus,
  getEsewaErrorMessage,
};
