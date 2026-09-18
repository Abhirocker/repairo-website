/* Repairo — track.html page logic */
(function () {
  const STATUS_LABEL = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled"
  };
  const STATUS_STEPS = ["pending", "confirmed", "in_progress", "completed"];

  const form = document.getElementById("track-form");
  const resultBox = document.getElementById("track-result");
  const defaultPanel = document.getElementById("track-panel-default");
  const resultPanel = document.getElementById("track-panel-result");

  function last10(phone) { return String(phone || "").replace(/\D/g, "").slice(-10); }

  function renderTimeline(order) {
    const el = document.getElementById("track-timeline");
    const entries = (order.timeline && order.timeline.length) ? order.timeline.slice().reverse() : [];
    el.innerHTML = entries.map(t => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div><b>${STATUS_LABEL[t.status] || t.status}</b><small>${t.note || ""} · ${new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</small></div>
      </div>`).join("");
  }

  function renderOrder(order) {
    document.getElementById("track-order-heading").textContent = `ORDER · ${order.orderId}`;
    document.getElementById("track-device-line").textContent =
      [order.device?.brand, order.device?.model].filter(Boolean).join(" ") || "Repair booking";
    const badge = document.getElementById("track-status-badge");
    badge.textContent = STATUS_LABEL[order.status] || order.status;
    badge.className = "status-badge " + order.status;
    renderTimeline(order);
    document.getElementById("track-items").innerHTML = (order.items || []).map(i => `
      <div class="service-item"><b>${i.partName} (${i.tier === "original" ? "Original" : "Duplicate"})</b><span>× ${i.qty} · ${RepairoCatalog.formatINR(i.unitPrice * i.qty)}</span></div>
    `).join("");
    document.getElementById("track-total").textContent = RepairoCatalog.formatINR(order.total || 0);
    document.getElementById("track-payment").textContent =
      `${(order.payment?.method || "").toUpperCase()} — ${(order.payment?.status || "").replace(/_/g, " ")}`;
    document.getElementById("track-whatsapp").onclick = () => RepairoNotify.notifyCustomerOnWhatsApp(
      order, `Hi, checking in about my Repairo order ${order.orderId}.`
    );
    defaultPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");
  }

  async function runLookup(id, phone) {
    resultBox.classList.remove("show");
    try {
      const order = await RepairoStore.getOrder(id);
      if (!order || last10(order.customer?.phone) !== last10(phone)) {
        resultBox.textContent = "We couldn't find a booking with that Order ID and mobile number. Double-check both and try again.";
        resultBox.style.color = "#8b4d30";
        resultBox.classList.add("show");
        resultPanel.classList.add("hidden");
        defaultPanel.classList.remove("hidden");
        return;
      }
      renderOrder(order);
    } catch (err) {
      console.error("Repairo: track lookup failed", err);
      resultBox.textContent = "Something went wrong looking up that order. Please try again in a moment.";
      resultBox.style.color = "#8b4d30";
      resultBox.classList.add("show");
    }
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById("track-id").value.trim();
    const phone = document.getElementById("track-phone").value.trim();
    if (!id || !phone) return;
    runLookup(id, phone);
  };

  // Prefill from ?id=REP-XXXXXX (from the checkout success screen).
  const params = new URLSearchParams(location.search);
  if (params.get("id")) document.getElementById("track-id").value = params.get("id");
})();
