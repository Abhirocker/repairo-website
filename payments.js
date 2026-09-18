/* ============================================================================
   REPAIRO — PAYMENTS
   ----------------------------------------------------------------------------
   Two real, independent ways to pay:

   1. UPI direct — a upi://pay link built from the shop's own UPI ID, turned
      into a scannable QR (via the free api.qrserver.com QR image service).
      Works the moment config.js has a real UPI_ID. Money lands directly in
      the shop's account — no gateway, no fee.

   2. Razorpay — a Payment Button created on the Razorpay Dashboard, with a
      "Customers Decide Amount" field. We inject the button's script tag
      ourselves so we can prefill that field with the exact cart total.
   ============================================================================ */

const RepairoPayments = (() => {

  function buildUpiUri(amount, note) {
    const params = new URLSearchParams({
      pa: REPAIRO_CONFIG.UPI_ID,
      pn: REPAIRO_CONFIG.UPI_PAYEE_NAME,
      am: Number(amount).toFixed(2),
      cu: "INR",
      tn: note || "Repairo order"
    });
    return "upi://pay?" + params.toString();
  }

  function qrImageUrl(data, size = 260) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  }

  // Injects a live Razorpay Payment Button into `container`, prefilled with
  // `amount`. Must use createElement + appendChild (not innerHTML) because
  // browsers won't execute a <script> tag inserted via innerHTML.
  function renderRazorpayButton(container, amount) {
    container.innerHTML = "";
    const form = document.createElement("form");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", REPAIRO_CONFIG.RAZORPAY_BUTTON_ID);
    script.setAttribute(
      `data-prefill.amount.${REPAIRO_CONFIG.RAZORPAY_AMOUNT_FIELD_KEY}`,
      Math.round(amount)
    );
    form.appendChild(script);
    container.appendChild(form);
  }

  function copyText(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return Promise.resolve();
  }

  return { buildUpiUri, qrImageUrl, renderRazorpayButton, copyText };
})();
