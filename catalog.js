/* Repairo — components.html page logic */
(function () {
  const grid = document.getElementById("catalog-grid");
  const tabsEl = document.getElementById("catalog-tabs");
  const cartLinesEl = document.getElementById("cart-lines");
  const cartTotalEl = document.getElementById("cart-total-amount");
  const cartFabCount = document.getElementById("cart-fab-count");
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  const checkoutLink = document.getElementById("checkout-link");

  function tierBox(item, tier) {
    const isOriginal = tier === "original";
    const price = isOriginal ? item.original : item.duplicate;
    const warranty = isOriginal ? item.originalWarranty : item.duplicateWarranty;
    return `
      <div class="tier-box ${tier}">
        <div class="tier-label">${isOriginal ? "✓ Original" : "Duplicate"}<small>${isOriginal ? "OEM-grade / genuine" : "Compatible / aftermarket"}</small></div>
        <div class="tier-price">${RepairoCatalog.formatINR(price)}</div>
        <div class="tier-warranty">${warranty} warranty</div>
        <button class="tier-add" type="button" data-item="${item.id}" data-tier="${tier}">Add to cart</button>
      </div>`;
  }

  function buildItemCard(item) {
    const el = document.createElement("article");
    el.className = "cat-item";
    el.innerHTML = `
      <div class="cat-item-head"><span class="cat-item-brand">${item.brand}</span><h4>${item.model}</h4></div>
      <div class="cat-item-tiers">${tierBox(item, "original")}${tierBox(item, "duplicate")}</div>`;
    el.querySelectorAll(".tier-add").forEach(btn => {
      btn.onclick = () => {
        RepairoCart.add(btn.dataset.item, btn.dataset.tier, 1);
        const original = btn.textContent;
        btn.textContent = "Added ✓";
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 800);
      };
    });
    return el;
  }

  function renderCatalog(filterId) {
    grid.innerHTML = "";
    const cats = filterId === "all" ? REPAIRO_CATALOG : REPAIRO_CATALOG.filter(c => c.id === filterId);
    cats.forEach(cat => {
      const section = document.createElement("div");
      section.className = "catalog-category";
      section.innerHTML = `<div class="catalog-category-head"><span class="cat-icon">${cat.icon}</span><div><h3>${cat.name}</h3><p>${cat.tagline}</p></div></div>`;
      const wrap = document.createElement("div");
      wrap.className = "cat-items";
      cat.items.forEach(item => wrap.appendChild(buildItemCard(item)));
      section.appendChild(wrap);
      grid.appendChild(section);
    });
  }

  function buildTabs() {
    const cats = [{ id: "all", name: "All components", icon: "✦" }, ...REPAIRO_CATALOG];
    tabsEl.innerHTML = "";
    cats.forEach(c => {
      const btn = document.createElement("button");
      btn.className = "cat-tab";
      btn.type = "button";
      btn.dataset.id = c.id;
      btn.innerHTML = `<span>${c.icon}</span> ${c.name}`;
      btn.onclick = () => setActiveTab(c.id);
      tabsEl.appendChild(btn);
    });
  }

  function setActiveTab(id) {
    document.querySelectorAll(".cat-tab").forEach(b => b.classList.toggle("active", b.dataset.id === id));
    renderCatalog(id);
    const url = id === "all" ? "components.html" : `components.html?cat=${id}`;
    history.replaceState(null, "", url);
  }

  function renderCart() {
    const lines = RepairoCart.lines();
    cartFabCount.textContent = RepairoCart.count();
    if (!lines.length) {
      cartLinesEl.innerHTML = `<p class="cart-empty">Your cart is empty. Add a component to start a booking.</p>`;
      checkoutLink.classList.add("disabled-link");
    } else {
      checkoutLink.classList.remove("disabled-link");
      cartLinesEl.innerHTML = lines.map(l => `
        <div class="cart-line">
          <div class="cart-line-info">
            <b>${l.item.model}</b>
            <small>${l.tier === "original" ? "Original" : "Duplicate"} · ${RepairoCatalog.formatINR(l.unitPrice)} each</small>
          </div>
          <div class="cart-line-qty">
            <button class="qty-btn" data-action="dec" data-item="${l.itemId}" data-tier="${l.tier}">−</button>
            <span>${l.qty}</span>
            <button class="qty-btn" data-action="inc" data-item="${l.itemId}" data-tier="${l.tier}">+</button>
          </div>
          <div class="cart-line-total">${RepairoCatalog.formatINR(l.lineTotal)}</div>
        </div>`).join("");
      cartLinesEl.querySelectorAll(".qty-btn").forEach(btn => {
        btn.onclick = () => {
          const line = RepairoCart.lines().find(l => l.itemId === btn.dataset.item && l.tier === btn.dataset.tier);
          const nextQty = (line ? line.qty : 0) + (btn.dataset.action === "inc" ? 1 : -1);
          RepairoCart.setQty(btn.dataset.item, btn.dataset.tier, nextQty);
        };
      });
    }
    cartTotalEl.textContent = RepairoCatalog.formatINR(RepairoCart.total());
  }

  document.addEventListener("repairo-cart-changed", renderCart);
  document.getElementById("cart-fab").onclick = () => { drawer.classList.add("open"); backdrop.classList.add("show"); };
  document.getElementById("cart-drawer-close").onclick = closeDrawer;
  backdrop.onclick = closeDrawer;
  function closeDrawer() { drawer.classList.remove("open"); backdrop.classList.remove("show"); }

  buildTabs();
  const params = new URLSearchParams(location.search);
  const requested = params.get("cat");
  const initial = requested && REPAIRO_CATALOG.some(c => c.id === requested) ? requested : "all";
  setActiveTab(initial);
  renderCart();
})();
