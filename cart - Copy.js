/* ============================================================================
   REPAIRO — CART
   ----------------------------------------------------------------------------
   A cart is inherently "this browser, right now" — so unlike orders, it
   always lives in localStorage, whether or not Firebase is connected.
   ============================================================================ */

const RepairoCart = (() => {
  const KEY = "repairo_cart";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch (e) { return []; }
  }
  function write(lines) {
    localStorage.setItem(KEY, JSON.stringify(lines));
    document.dispatchEvent(new CustomEvent("repairo-cart-changed"));
  }

  function add(itemId, tier, qty = 1) {
    const lines = read();
    const existing = lines.find(l => l.itemId === itemId && l.tier === tier);
    if (existing) existing.qty += qty;
    else lines.push({ itemId, tier, qty });
    write(lines);
  }

  function setQty(itemId, tier, qty) {
    let lines = read();
    if (qty <= 0) {
      lines = lines.filter(l => !(l.itemId === itemId && l.tier === tier));
    } else {
      const existing = lines.find(l => l.itemId === itemId && l.tier === tier);
      if (existing) existing.qty = qty;
      else lines.push({ itemId, tier, qty });
    }
    write(lines);
  }

  function remove(itemId, tier) {
    write(read().filter(l => !(l.itemId === itemId && l.tier === tier)));
  }

  function clear() { write([]); }

  // Resolves each cart line against the live catalogue (so price/warranty
  // edits in catalog-data.js are always reflected, never stale).
  function resolvedLines() {
    return read().map(line => {
      const item = RepairoCatalog.item(line.itemId);
      if (!item) return null;
      const unitPrice = line.tier === "original" ? item.original : item.duplicate;
      const warranty = line.tier === "original" ? item.originalWarranty : item.duplicateWarranty;
      return {
        ...line,
        item,
        unitPrice,
        warranty,
        lineTotal: unitPrice * line.qty
      };
    }).filter(Boolean);
  }

  function total() {
    return resolvedLines().reduce((sum, l) => sum + l.lineTotal, 0);
  }

  function count() {
    return read().reduce((sum, l) => sum + l.qty, 0);
  }

  return { add, setQty, remove, clear, lines: resolvedLines, raw: read, total, count };
})();
