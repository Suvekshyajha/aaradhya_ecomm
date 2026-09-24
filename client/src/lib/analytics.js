// Google Analytics 4 helper for the AARADHYA Vite/React frontend.
//
// The measurement ID always comes from the `VITE_GA_MEASUREMENT_ID`
// environment variable - nothing is hard-coded here. When the variable is
// empty (e.g. local development), every helper below is a safe no-op.
// No personal data (names, emails, addresses, phones) is ever sent.

let gaInitialised = false;
let gaMeasurementId = "";

function getMeasurementId() {
  // Vite exposes only variables prefixed with VITE_ to the browser.
  return (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
}

function gtagAvailable() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Load the gtag.js script once and configure the measurement ID.
 * The static snippet in index.html already loads gtag.js, so this reuses
 * it when present instead of injecting a duplicate script tag. */
export function initGA() {
  if (gaInitialised || typeof document === "undefined") return;
  const measurementId = getMeasurementId();
  if (!measurementId) return;

  gaMeasurementId = measurementId;

  // Static tag in index.html already loads gtag.js. Only inject as fallback
  // (e.g. ID changed without updating index.html) and never twice.
  if (
    !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
  ) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  if (!gtagAvailable()) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }
  gaInitialised = true;
}

/** Returns true when GA4 was initialised with a measurement ID. */
export function isGAEnabled() {
  return gaInitialised && Boolean(gaMeasurementId) && gtagAvailable();
}

/** Low-level event sender. Drops the event when GA is not configured. */
export function trackEvent(eventName, params = {}) {
  if (!isGAEnabled()) return;
  window.gtag("event", eventName, { ...params });
}

/** SPA page-view. Call on every React route change. */
export function trackPageView(path) {
  if (!isGAEnabled()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

function toGAItem(product, quantity = 1) {
  if (!product) return null;
  const price = Number(product.salePrice > 0 ? product.salePrice : product.price);
  return {
    item_id: String(product._id || product.id || ""),
    item_name: product.title || "",
    item_category: product.category || "",
    item_brand: product.brand || "",
    price: Number.isFinite(price) ? price : 0,
    quantity: Number.isFinite(Number(quantity)) ? Number(quantity) : 1,
  };
}

/** GA4 `view_item` - product details dialog opened. */
export function trackViewItem(product) {
  const item = toGAItem(product, 1);
  if (!item) return;
  trackEvent("view_item", { currency: "NPR", value: item.price, items: [item] });
}

/** GA4 `add_to_cart`. */
export function trackAddToCart(product, quantity = 1) {
  const item = toGAItem(product, quantity);
  if (!item) return;
  trackEvent("add_to_cart", {
    currency: "NPR",
    value: item.price * item.quantity,
    items: [item],
  });
}

/** GA4 `remove_from_cart`. */
export function trackRemoveFromCart(product, quantity = 1) {
  const item = toGAItem(product, quantity);
  if (!item) return;
  trackEvent("remove_from_cart", {
    currency: "NPR",
    value: item.price * item.quantity,
    items: [item],
  });
}

/** GA4 `begin_checkout` - cart items only, never address/personal data. */
export function trackBeginCheckout(cartItems = []) {
  const items = (cartItems || []).map((item) => toGAItem(item, item.quantity)).filter(Boolean);
  if (!items.length) return;
  const value = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  trackEvent("begin_checkout", { currency: "NPR", value, items });
}

/** GA4 `purchase` - order id + totals only, never buyer personal data. */
export function trackPurchase({ orderId, cartItems = [], total }) {
  const items = (cartItems || []).map((item) => toGAItem(item, item.quantity)).filter(Boolean);
  const value = Number(total);
  trackEvent("purchase", {
    transaction_id: String(orderId || ""),
    currency: "NPR",
    value: Number.isFinite(value) ? value : items.reduce((s, i) => s + i.price * i.quantity, 0),
    items,
  });
}

/** Affiliate referral outbound click - product id + partner only, no PII. */
export function trackAffiliateClick(product, partner = "") {
  if (!product) return;
  trackEvent("affiliate_click", {
    item_id: String(product._id || product.id || ""),
    item_name: product.title || "",
    partner: String(partner || product.affiliatePartner || ""),
  });
}

/** Paid display-ad outbound click - ad id + placement only, no PII. */
export function trackAdClick(ad) {
  if (!ad) return;
  trackEvent("ad_click", {
    ad_id: String(ad._id || ad.id || ""),
    ad_title: ad.title || "",
    placement: ad.placement || "",
  });
}
