/* ============================================================================
   REPAIRO — NOTIFICATIONS (email + WhatsApp)
   ----------------------------------------------------------------------------
   EMAIL — sent via EmailJS directly from the browser, no server. Needs the
   EmailJS keys in config.js (Part 4 of SETUP_GUIDE.md).

   WHATSAPP — there is no free way to send a WhatsApp message with zero taps
   from a plain website; that needs the paid, business-verified WhatsApp
   Business Platform (Meta Cloud API, or resellers like Twilio/AiSensy/
   Interakt — see SETUP_GUIDE.md → Part 6 if you want that later).

   What works today, for free, is WhatsApp's own "click-to-chat" links
   (wa.me/...). We use them two ways:
     • Right after booking, we open one addressed to the SHOP's number with
       the order pre-filled — the customer just taps Send, and you get the
       order on WhatsApp instantly.
     • On the tracking page and technician panel, buttons open one addressed
       to the CUSTOMER's number with a status update pre-filled.
   ============================================================================ */

const RepairoNotify = (() => {
  let emailjsReady = false;

  function ensureEmailJs() {
    if (emailjsReady || !REPAIRO_CONFIG.emailReady || typeof emailjs === "undefined") return;
    emailjs.init({ publicKey: REPAIRO_CONFIG.EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
  }

  function itemsAsText(order) {
    return (order.items || [])
      .map(i => `${i.qty} x ${i.partName} (${i.tier}) — ${RepairoCatalog.formatINR(i.unitPrice * i.qty)}`)
      .join("\n");
  }

  function orderSummaryText(order) {
    return [
      `Repairo order ${order.orderId}`,
      `Customer: ${order.customer?.name} (${order.customer?.phone})`,
      `Device: ${order.device?.brand || ""} ${order.device?.model || ""}`.trim(),
      `Items:`,
      itemsAsText(order),
      `Total: ${RepairoCatalog.formatINR(order.total)}`,
      `Payment: ${order.payment?.method?.toUpperCase()} (${order.payment?.status})`,
      `Status: ${order.status}`
    ].join("\n");
  }

  async function sendConfirmationEmail(order) {
    ensureEmailJs();
    if (!emailjsReady) {
      return { sent: false, reason: "EmailJS not configured — see SETUP_GUIDE.md Part 4." };
    }
    const params = {
      order_id: order.orderId,
      to_name: order.customer?.name || "Customer",
      to_email: order.customer?.email || "",
      device: `${order.device?.brand || ""} ${order.device?.model || ""}`.trim(),
      items_text: itemsAsText(order),
      total: RepairoCatalog.formatINR(order.total),
      payment_method: order.payment?.method,
      payment_status: order.payment?.status,
      status: order.status,
      shop_name: REPAIRO_CONFIG.SHOP_NAME,
      shop_email: REPAIRO_CONFIG.SHOP_EMAIL
    };
    try {
      await emailjs.send(REPAIRO_CONFIG.EMAILJS_SERVICE_ID, REPAIRO_CONFIG.EMAILJS_TEMPLATE_ID, params);
      return { sent: true };
    } catch (err) {
      console.warn("Repairo: EmailJS send failed", err);
      return { sent: false, reason: "EmailJS send failed — check your keys/template in config.js." };
    }
  }

  function normalizePhone(phone) {
    let digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 10) digits = "91" + digits;
    if (digits.length === 11 && digits.startsWith("0")) digits = "91" + digits.slice(1);
    return digits;
  }

  function buildWhatsAppLink(phone, message) {
    return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
  }

  // Opens WhatsApp addressed to the SHOP, pre-filled with the new order.
  // One tap (Send) from the customer, right after booking.
  function notifyShopOnWhatsApp(order) {
    if (!REPAIRO_CONFIG.whatsappReady) return null;
    const msg = `New Repairo booking!\n\n${orderSummaryText(order)}`;
    const url = buildWhatsAppLink(REPAIRO_CONFIG.SHOP_WHATSAPP, msg);
    window.open(url, "_blank");
    return url;
  }

  // Opens WhatsApp addressed to the CUSTOMER, pre-filled with a status
  // update. Used from the tracking page and the technician panel.
  function notifyCustomerOnWhatsApp(order, customMessage) {
    const msg = customMessage ||
      `Hi ${order.customer?.name || ""}, update on your Repairo order ${order.orderId}: ${order.status.replace("_", " ")}.`;
    const url = buildWhatsAppLink(order.customer?.phone, msg);
    window.open(url, "_blank");
    return url;
  }

  return { sendConfirmationEmail, orderSummaryText, buildWhatsAppLink, notifyShopOnWhatsApp, notifyCustomerOnWhatsApp };
})();
