/* ============================================================================
   REPAIRO — SHOP CONFIGURATION
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to make bookings, payments, email
   and WhatsApp confirmations work with YOUR shop's real details.

   Every value below is a placeholder. Replace the ones you're ready to use —
   the site works in DEMO MODE for anything you leave untouched (orders are
   saved in the browser instead of a shared database, and payment/email/
   WhatsApp steps show what WOULD happen instead of actually sending).

   Full walkthrough for every value here: see SETUP_GUIDE.md
   ============================================================================ */

const REPAIRO_CONFIG = {

  /* ---------------------------------------------------------------------
     1. SHOP DETAILS — shown on receipts, emails & WhatsApp messages
  --------------------------------------------------------------------- */
  SHOP_NAME: "Repairo",
  SHOP_CITY: "Sambalpur, Odisha",

  // Shop's own WhatsApp number, with country code, digits only (no + or spaces).
  // Example for a Sambalpur number: "919876543210"
  SHOP_WHATSAPP: "91XXXXXXXXXX",

  // Email where YOU want to be told about new bookings.
  SHOP_EMAIL: "your-shop@example.com",

  /* ---------------------------------------------------------------------
     2. UPI PAYMENTS — works the moment you add your real UPI ID.
     No account signup needed for this one — it's just your own UPI ID,
     the same one linked to GPay / PhonePe / Paytm / your bank app.
  --------------------------------------------------------------------- */
  UPI_ID: "yourshop@upi",          // e.g. "9876543210@ybl" or "repairo@icici"
  UPI_PAYEE_NAME: "Repairo",       // name shown in the customer's UPI app

  /* ---------------------------------------------------------------------
     3. RAZORPAY — card / netbanking / wallet / UPI-in-one-checkout.
     Free to sign up. Paste the Payment Button ID you create on the
     Razorpay Dashboard (starts with "pl_"). Leave the placeholder to
     show a "coming soon" message on the card tab instead of a broken button.
     Setup: SETUP_GUIDE.md → Part 3.
  --------------------------------------------------------------------- */
  RAZORPAY_BUTTON_ID: "pl_YOUR_BUTTON_ID",
  // The exact field key you gave the "Customers Decide Amount" field when
  // creating the button (Razorpay turns spaces into underscores, lowercase).
  // e.g. if you labelled the field "Repair Total", the key is "repair_total".
  RAZORPAY_AMOUNT_FIELD_KEY: "repair_total",

  /* ---------------------------------------------------------------------
     4. EMAILJS — sends the booking confirmation email, no server needed.
     Free tier: ~200 emails/month. Setup: SETUP_GUIDE.md → Part 4.
  --------------------------------------------------------------------- */
  EMAILJS_PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",
  EMAILJS_SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",
  EMAILJS_TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID",

  /* ---------------------------------------------------------------------
     5. FIREBASE — the shared database behind real order status tracking.
     Without this, bookings only live in the customer's own browser and
     can't be looked up from another device or updated by you.
     Free tier is generous for a small shop. Setup: SETUP_GUIDE.md → Part 5.
  --------------------------------------------------------------------- */
  FIREBASE: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxx"
  },

  /* ---------------------------------------------------------------------
     Internal — do not edit below this line.
     These just detect whether you've filled in the sections above yet,
     so the site can quietly fall back to demo mode for anything not set up.
  --------------------------------------------------------------------- */
  get upiReady()      { return this.UPI_ID && !this.UPI_ID.startsWith("yourshop@"); },
  get razorpayReady() { return this.RAZORPAY_BUTTON_ID && !this.RAZORPAY_BUTTON_ID.includes("YOUR_BUTTON_ID"); },
  get emailReady()     { return this.EMAILJS_PUBLIC_KEY && !this.EMAILJS_PUBLIC_KEY.includes("YOUR_EMAILJS"); },
  get whatsappReady()  { return this.SHOP_WHATSAPP && !this.SHOP_WHATSAPP.includes("XXXXXXXXXX"); },
  get firebaseReady()  { return this.FIREBASE.apiKey && !this.FIREBASE.apiKey.includes("YOUR_FIREBASE"); }
};
