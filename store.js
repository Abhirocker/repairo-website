/* ============================================================================
   REPAIRO — ORDER STORE
   ----------------------------------------------------------------------------
   One consistent API for saving/reading/updating orders, backed by:

     • Firebase Firestore, when config.js has real Firebase keys (REAL,
       shared, works across devices — customer books on their phone,
       you see it on your laptop).
     • Browser localStorage, when it doesn't (DEMO MODE — lets you test
       the entire flow on one device before setting anything up. Orders
       made in demo mode only exist in that one browser).

   Every page talks to `RepairoStore`, never to Firebase directly, so the
   fallback is invisible to the rest of the code.
   ============================================================================ */

const RepairoStore = (() => {
  const LS_ORDERS_KEY = "repairo_demo_orders";
  const LS_AUTH_KEY = "repairo_demo_admin_session";
  let firebaseApp = null;
  let db = null;
  let auth = null;
  const live = REPAIRO_CONFIG.firebaseReady && typeof firebase !== "undefined";

  if (live) {
    try {
      firebaseApp = firebase.initializeApp(REPAIRO_CONFIG.FIREBASE);
      db = firebase.firestore();
      auth = firebase.auth();
    } catch (e) {
      console.warn("Repairo: Firebase failed to initialise, falling back to demo mode.", e);
    }
  }

  function isLive() { return !!db; }

  function makeOrderId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easier to read aloud
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return "REP-" + code;
  }

  function readLocalOrders() {
    try { return JSON.parse(localStorage.getItem(LS_ORDERS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function writeLocalOrders(map) {
    localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(map));
  }

  /* ---------------- Orders ---------------- */

  async function createOrder(orderData) {
    const orderId = makeOrderId();
    const now = new Date().toISOString();
    const order = {
      orderId,
      createdAt: now,
      updatedAt: now,
      status: "pending",
      timeline: [{ status: "pending", note: "Booking received", at: now }],
      ...orderData
    };

    if (isLive()) {
      await db.collection("orders").doc(orderId).set(order);
    } else {
      const all = readLocalOrders();
      all[orderId] = order;
      writeLocalOrders(all);
    }
    return order;
  }

  async function getOrder(orderId) {
    orderId = (orderId || "").trim().toUpperCase();
    if (!orderId) return null;
    if (isLive()) {
      const doc = await db.collection("orders").doc(orderId).get();
      return doc.exists ? doc.data() : null;
    }
    const all = readLocalOrders();
    return all[orderId] || null;
  }

  // Admin only — requires auth in live mode (enforced by Firestore rules too).
  async function listOrders() {
    if (isLive()) {
      const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(200).get();
      return snap.docs.map(d => d.data());
    }
    const all = readLocalOrders();
    return Object.values(all).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async function updateOrder(orderId, patch, timelineNote) {
    orderId = (orderId || "").trim().toUpperCase();
    const now = new Date().toISOString();
    if (isLive()) {
      const ref = db.collection("orders").doc(orderId);
      const update = { ...patch, updatedAt: now };
      if (timelineNote) {
        update.timeline = firebase.firestore.FieldValue.arrayUnion({
          status: patch.status || timelineNote.status || "updated",
          note: timelineNote.note || "",
          at: now
        });
      }
      await ref.update(update);
      const doc = await ref.get();
      return doc.data();
    }
    const all = readLocalOrders();
    const existing = all[orderId];
    if (!existing) return null;
    Object.assign(existing, patch, { updatedAt: now });
    if (timelineNote) {
      existing.timeline = existing.timeline || [];
      existing.timeline.push({
        status: patch.status || timelineNote.status || "updated",
        note: timelineNote.note || "",
        at: now
      });
    }
    all[orderId] = existing;
    writeLocalOrders(all);
    return existing;
  }

  function updateStatus(orderId, status, note) {
    return updateOrder(orderId, { status }, { status, note });
  }

  function updatePayment(orderId, paymentPatch, note) {
    return updateOrder(orderId, { payment: paymentPatch }, note ? { note } : null);
  }

  /* ---------------- Admin auth (technician / shop-owner sign-in) ---------------- */

  // Firebase's auth.onAuthStateChanged fires immediately with the current
  // user AND every time sign-in state changes afterwards. The demo fallback
  // has to behave the same way (not just once at registration), or the admin
  // panel would never appear after a demo sign-in.
  const demoAuthListeners = [];
  function demoSession() {
    const raw = localStorage.getItem(LS_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  function notifyDemoAuthListeners() {
    const session = demoSession();
    demoAuthListeners.forEach(cb => cb(session));
  }

  async function signIn(email, password) {
    if (isLive()) {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      return cred.user;
    }
    // Demo mode: no real account system — just a local "signed in" flag so the
    // admin panel UI can be tested before Firebase Auth is connected.
    localStorage.setItem(LS_AUTH_KEY, JSON.stringify({ email, demo: true, at: Date.now() }));
    notifyDemoAuthListeners();
    return { email, demo: true };
  }

  function signOut() {
    if (isLive()) return auth.signOut();
    localStorage.removeItem(LS_AUTH_KEY);
    notifyDemoAuthListeners();
    return Promise.resolve();
  }

  function onAuthChange(cb) {
    if (isLive()) {
      auth.onAuthStateChanged(cb);
    } else {
      demoAuthListeners.push(cb);
      cb(demoSession());
    }
  }

  return {
    isLive,
    makeOrderId,
    createOrder,
    getOrder,
    listOrders,
    updateOrder,
    updateStatus,
    updatePayment,
    signIn,
    signOut,
    onAuthChange
  };
})();
