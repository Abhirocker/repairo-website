/* Repairo — technician.html admin panel logic */
(function () {
  const STATUS_LABEL = { pending: "Pending", confirmed: "Confirmed", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
  const loginForm = document.getElementById("tech-login");
  const resultBox = document.getElementById("tech-result");
  const adminSection = document.getElementById("admin-orders-section");
  const ordersList = document.getElementById("admin-orders-list");
  const modeLabel = document.getElementById("admin-mode-label");

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("tech-email").value.trim();
    const password = document.getElementById("tech-password").value;
    resultBox.classList.remove("show");
    try {
      await RepairoStore.signIn(email, password);
      resultBox.textContent = RepairoStore.isLive()
        ? "✓ Signed in. Loading your live bookings below…"
        : "✓ Demo sign-in (Firebase not connected yet — showing orders saved on this device only).";
      resultBox.style.color = "#5a7115";
      resultBox.classList.add("show");
    } catch (err) {
      console.error("Repairo: technician sign-in failed", err);
      resultBox.textContent = "Couldn't sign in — check the email/password, or create this login in Firebase Console → Authentication.";
      resultBox.style.color = "#8b4d30";
      resultBox.classList.add("show");
    }
  };

  document.getElementById("admin-signout").onclick = () => RepairoStore.signOut();
  document.getElementById("admin-refresh").onclick = loadOrders;

  function orderRow(order) {
    const itemsSummary = (order.items || []).map(i => `${i.qty}× ${i.partName} (${i.tier})`).join(", ");
    const row = document.createElement("div");
    row.className = "admin-order-row";
    row.innerHTML = `
      <div class="admin-order-main">
        <div class="admin-order-top"><b>${order.orderId}</b><span class="status-badge ${order.status}">${STATUS_LABEL[order.status] || order.status}</span></div>
        <div>${order.customer?.name || ""} · ${order.customer?.phone || ""} · ${order.customer?.city || ""}</div>
        <div class="admin-order-device">${[order.device?.brand, order.device?.model].filter(Boolean).join(" ") || "—"}${order.device?.notes ? " — " + order.device.notes : ""}</div>
        <div class="admin-order-items">${itemsSummary}</div>
        <div class="admin-order-total">${RepairoCatalog.formatINR(order.total || 0)} · ${(order.payment?.method || "").toUpperCase()} · ${(order.payment?.status || "").replace(/_/g, " ")}</div>
      </div>
      <div class="admin-order-actions">
        <select class="status-select">
          ${Object.keys(STATUS_LABEL).map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${STATUS_LABEL[s]}</option>`).join("")}
        </select>
        <button type="button" class="mark-paid-btn" ${order.payment?.status === "paid" ? "disabled" : ""}>${order.payment?.status === "paid" ? "Payment received ✓" : "Mark payment received"}</button>
        <button type="button" class="whatsapp-notify-btn">Notify on WhatsApp</button>
      </div>`;

    row.querySelector(".status-select").onchange = async (e) => {
      await RepairoStore.updateStatus(order.orderId, e.target.value, "Updated by technician");
      loadOrders();
    };
    row.querySelector(".mark-paid-btn").onclick = async () => {
      await RepairoStore.updatePayment(order.orderId, { ...order.payment, status: "paid" }, "Payment confirmed by technician");
      loadOrders();
    };
    row.querySelector(".whatsapp-notify-btn").onclick = () => RepairoNotify.notifyCustomerOnWhatsApp(order);
    return row;
  }

  async function loadOrders() {
    ordersList.innerHTML = `<p class="cart-empty">Loading…</p>`;
    try {
      const orders = await RepairoStore.listOrders();
      if (!orders.length) {
        ordersList.innerHTML = `<p class="cart-empty">No bookings yet.</p>`;
        return;
      }
      ordersList.innerHTML = "";
      orders.forEach(o => ordersList.appendChild(orderRow(o)));
    } catch (err) {
      console.error("Repairo: failed to load orders", err);
      ordersList.innerHTML = `<p class="cart-empty">Couldn't load bookings — if you just connected Firebase, make sure the security rules from SETUP_GUIDE.md are published.</p>`;
    }
  }

  RepairoStore.onAuthChange((user) => {
    if (user) {
      adminSection.style.display = "block";
      modeLabel.textContent = RepairoStore.isLive()
        ? "Real bookings made through the site."
        : "Demo mode — bookings saved on this device only.";
      loadOrders();
    } else {
      adminSection.style.display = "none";
    }
  });
})();
