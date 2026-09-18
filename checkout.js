/* Repairo — checkout.html page logic */
(function () {
  const form = document.getElementById("checkout-form");
  const summaryLines = document.getElementById("summary-lines");
  const summaryTotal = document.getElementById("summary-total");
  const errorBox = document.getElementById("checkout-error");
  const submitBtn = document.getElementById("checkout-submit");
  let activeMethod = "upi";

  function renderSummary() {
    const lines = RepairoCart.lines();
    if (!lines.length) {
      summaryLines.innerHTML = `<p class="cart-empty">Your cart is empty. <a href="components.html">Go pick some components →</a></p>`;
      submitBtn.disabled = true;
    } else {
      summaryLines.innerHTML = lines.map(l => `
        <div class="cart-line">
          <div class="cart-line-info"><b>${l.item.model}</b><small>${l.tier === "original" ? "Original" : "Duplicate"} × ${l.qty}</small></div>
          <div class="cart-line-total">${RepairoCatalog.formatINR(l.lineTotal)}</div>
        </div>`).join("");
      submitBtn.disabled = false;
    }
    const total = RepairoCart.total();
    summaryTotal.textContent = RepairoCatalog.formatINR(total);
    refreshPaymentPanel(total);
  }

  function refreshPaymentPanel(total) {
    if (activeMethod === "upi") {
      const note = `Repairo order · ${REPAIRO_CONFIG.SHOP_NAME}`;
      const uri = RepairoPayments.buildUpiUri(total, note);
      document.getElementById("upi-qr").src = RepairoPayments.qrImageUrl(uri);
      document.getElementById("upi-id-text").textContent = REPAIRO_CONFIG.UPI_ID;
      document.getElementById("upi-app-link").href = uri;
    }
    if (activeMethod === "razorpay") {
      const container = document.getElementById("razorpay-container");
      if (REPAIRO_CONFIG.razorpayReady) {
        RepairoPayments.renderRazorpayButton(container, total);
      } else {
        container.innerHTML = `<p class="pay-note">Card payments aren't connected yet — add your Razorpay Payment Button ID in config.js (see SETUP_GUIDE.md → Part 3). Choose UPI or "pay after service" for now.</p>`;
      }
    }
  }

  document.getElementById("pay-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".pay-tab");
    if (!btn) return;
    activeMethod = btn.dataset.method;
    document.querySelectorAll(".pay-tab").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".pay-panel").forEach(p => p.classList.add("hidden"));
    document.getElementById(`pay-${activeMethod}`).classList.remove("hidden");
    refreshPaymentPanel(RepairoCart.total());
  });

  document.getElementById("copy-upi").onclick = () => {
    RepairoPayments.copyText(REPAIRO_CONFIG.UPI_ID);
    const btn = document.getElementById("copy-upi");
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = original), 1000);
  };

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add("show");
  }
  function clearError() {
    errorBox.classList.remove("show");
    errorBox.textContent = "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();
    const lines = RepairoCart.lines();
    if (!lines.length) { showError("Your cart is empty — add a component first."); return; }
    if (activeMethod === "upi" && !document.getElementById("upi-confirm-check").checked) {
      showError("Please confirm you've completed the UPI payment, or choose a different payment method.");
      return;
    }

    const fd = new FormData(form);
    const total = RepairoCart.total();
    const paymentStatus = activeMethod === "cod" ? "pay_on_completion" : "awaiting_confirmation";

    const order = {
      customer: {
        name: fd.get("name")?.trim(),
        phone: fd.get("phone")?.trim(),
        email: fd.get("email")?.trim(),
        city: fd.get("city")?.trim()
      },
      device: {
        brand: fd.get("deviceBrand")?.trim() || "",
        model: fd.get("deviceModel")?.trim() || "",
        notes: fd.get("notes")?.trim() || ""
      },
      items: lines.map(l => ({
        category: l.item.categoryName,
        partName: `${l.item.brand} ${l.item.model}`,
        tier: l.tier,
        unitPrice: l.unitPrice,
        qty: l.qty,
        warranty: l.warranty
      })),
      subtotal: total,
      total,
      currency: "INR",
      payment: { method: activeMethod, status: paymentStatus }
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Booking…";

    try {
      const saved = await RepairoStore.createOrder(order);
      const emailResult = await RepairoNotify.sendConfirmationEmail(saved);
      const whatsappOpened = RepairoNotify.notifyShopOnWhatsApp(saved);
      RepairoCart.clear();
      // The order is already safely saved at this point — a hiccup in the
      // on-screen success display shouldn't be reported as a failed booking.
      try {
        showSuccess(saved, emailResult, whatsappOpened);
      } catch (displayErr) {
        console.warn("Repairo: order saved, but the confirmation screen hit a display error", displayErr);
      }
    } catch (err) {
      console.error("Repairo: order creation failed", err);
      showError("Something went wrong saving your booking. Please try again, or contact us directly on WhatsApp.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm booking →";
    }
  });

  function showSuccess(order, emailResult, whatsappOpened) {
    document.getElementById("checkout-live").classList.add("hidden");
    const successSection = document.getElementById("checkout-success");
    successSection.classList.remove("hidden");
    document.getElementById("success-order-id").textContent = order.orderId;
    document.getElementById("success-track-link").href = `track.html?id=${order.orderId}`;
    document.getElementById("success-whatsapp").onclick = () =>
      RepairoNotify.buildWhatsAppLink(REPAIRO_CONFIG.SHOP_WHATSAPP, `Hi, I just booked order ${order.orderId} — checking in!`) &&
      window.open(RepairoNotify.buildWhatsAppLink(REPAIRO_CONFIG.SHOP_WHATSAPP, `Hi, I just booked order ${order.orderId} — checking in!`), "_blank");

    const notes = [];
    notes.push(RepairoStore.isLive()
      ? "Your order is saved and can be tracked from any device."
      : "Demo mode: this order is saved on this device only — connect Firebase (SETUP_GUIDE.md → Part 5) so it can be tracked from anywhere.");
    if (!emailResult.sent) notes.push("Email confirmation not sent: " + emailResult.reason);
    if (!whatsappOpened) notes.push("WhatsApp notice not sent — add your shop's WhatsApp number in config.js.");
    document.getElementById("success-note").innerHTML = notes.map(n => `<div>${n}</div>`).join("");
    document.getElementById("success-note").classList.add("show");
    if (typeof successSection.scrollIntoView === "function") {
      successSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  document.addEventListener("repairo-cart-changed", renderSummary);
  renderSummary();
})();
