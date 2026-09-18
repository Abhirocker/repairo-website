/* ============================================================================
   REPAIRO — COMPONENTS CATALOGUE & PRICING
   ----------------------------------------------------------------------------
   Starting prices for every component Repairo lists, in INR, split into the
   two tiers technicians actually stock:

     ORIGINAL   — OEM-grade / genuine-pull component. Longer warranty.
     DUPLICATE  — Quality-checked compatible/aftermarket component.
                  Shorter warranty, lower price, good for budget repairs.

   These prices are calibrated against real Indian repair-market pricing
   (authorised service-centre rates, marketplace listings and wholesale
   parts-supplier pricing) as a realistic STARTING POINT. Adjust every
   number here to match what you actually pay your own suppliers — that's
   the whole point of keeping this in one file.
   ============================================================================ */

const REPAIRO_CATALOG = [
  {
    id: "screens",
    name: "Premium Screens",
    icon: "📱",
    tagline: "Display assemblies for Apple, Samsung, Xiaomi, Realme, Vivo, Oppo & OnePlus.",
    items: [
      { id: "scr-iphone-15",     brand: "Apple",                model: "iPhone 15 / 15 Plus",              original: 16999, duplicate: 7999,  originalWarranty: "12 months", duplicateWarranty: "4 months" },
      { id: "scr-iphone-13-14",  brand: "Apple",                model: "iPhone 13 / 14 series",             original: 11999, duplicate: 5499,  originalWarranty: "12 months", duplicateWarranty: "4 months" },
      { id: "scr-iphone-11-12",  brand: "Apple",                model: "iPhone 11 / 12 series",             original: 7999,  duplicate: 3499,  originalWarranty: "12 months", duplicateWarranty: "3 months" },
      { id: "scr-samsung-flag",  brand: "Samsung",              model: "Galaxy S / Note series (AMOLED)",   original: 13999, duplicate: 6499,  originalWarranty: "12 months", duplicateWarranty: "4 months" },
      { id: "scr-samsung-a",     brand: "Samsung",              model: "Galaxy A / M series",               original: 3999,  duplicate: 1799,  originalWarranty: "9 months",  duplicateWarranty: "3 months" },
      { id: "scr-oneplus",       brand: "OnePlus",               model: "Nord & numbered series",            original: 5499,  duplicate: 2499,  originalWarranty: "9 months",  duplicateWarranty: "3 months" },
      { id: "scr-redmi-realme",  brand: "Xiaomi / Redmi / Realme", model: "Redmi Note & Realme numbered series", original: 2299, duplicate: 1099, originalWarranty: "6 months", duplicateWarranty: "3 months" },
      { id: "scr-vivo-oppo",     brand: "Vivo / Oppo",           model: "Y & F series",                       original: 2199,  duplicate: 999,   originalWarranty: "6 months",  duplicateWarranty: "3 months" }
    ]
  },
  {
    id: "batteries",
    name: "Batteries",
    icon: "🔋",
    tagline: "Replacement cells engineered for safe, stable output and longer runtime.",
    items: [
      { id: "bat-iphone",        brand: "Apple",                        model: "iPhone 11–15 series",              original: 2499, duplicate: 1199, originalWarranty: "12 months", duplicateWarranty: "3 months" },
      { id: "bat-samsung",       brand: "Samsung",                      model: "Galaxy S / A / M / Note series",   original: 1499, duplicate: 699,  originalWarranty: "9 months",  duplicateWarranty: "3 months" },
      { id: "bat-xiaomi",        brand: "Xiaomi / Redmi",                model: "Redmi Note & Mi numbered series",  original: 899,  duplicate: 449,  originalWarranty: "6 months",  duplicateWarranty: "3 months" },
      { id: "bat-oneplus",       brand: "OnePlus",                       model: "Nord & numbered series",           original: 1199, duplicate: 599,  originalWarranty: "9 months",  duplicateWarranty: "3 months" },
      { id: "bat-vivo-oppo-realme", brand: "Vivo / Oppo / Realme",       model: "Y / F / numbered series",          original: 799,  duplicate: 399,  originalWarranty: "6 months",  duplicateWarranty: "3 months" }
    ]
  },
  {
    id: "charging",
    name: "Charging Ports",
    icon: "🔌",
    tagline: "Precision charging-port flex modules, installed with technician training.",
    items: [
      { id: "cp-iphone-lightning", brand: "Apple", model: "iPhone (Lightning) 11–14 series", original: 1799, duplicate: 799, originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cp-iphone-usbc",      brand: "Apple", model: "iPhone 15 series (USB-C)",          original: 1999, duplicate: 899, originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cp-samsung",          brand: "Samsung", model: "Galaxy S / A / M / Note (USB-C)",  original: 899,  duplicate: 399, originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cp-android-usbc",     brand: "Xiaomi / Realme / Vivo / Oppo / OnePlus", model: "Universal USB-C flex", original: 599, duplicate: 279, originalWarranty: "6 months", duplicateWarranty: "2 months" }
    ]
  },
  {
    id: "cameras",
    name: "Cameras & More",
    icon: "📷",
    tagline: "Rear & front camera modules and other supporting repair components.",
    items: [
      { id: "cam-iphone-rear",  brand: "Apple",  model: "iPhone 12–15 rear camera module",         original: 4499, duplicate: 1999, originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cam-iphone-front", brand: "Apple",  model: "iPhone front / TrueDepth module",          original: 2499, duplicate: 1199, originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cam-samsung",      brand: "Samsung", model: "Galaxy S / A / Note camera module",       original: 1899, duplicate: 899,  originalWarranty: "6 months", duplicateWarranty: "2 months" },
      { id: "cam-android-generic", brand: "Xiaomi / Realme / Vivo / Oppo / OnePlus", model: "Rear / front camera module", original: 999, duplicate: 499, originalWarranty: "6 months", duplicateWarranty: "2 months" }
    ]
  }
];

/* Small helpers used across pages */
const RepairoCatalog = {
  all() { return REPAIRO_CATALOG; },
  category(catId) { return REPAIRO_CATALOG.find(c => c.id === catId); },
  item(itemId) {
    for (const cat of REPAIRO_CATALOG) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) return { ...found, categoryId: cat.id, categoryName: cat.name };
    }
    return null;
  },
  formatINR(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }
};
