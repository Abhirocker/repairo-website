# Repairo — Setup Guide

This turns the site from a demo into something that takes real bookings, real
payments, and sends real emails/WhatsApp messages — using **free accounts you
control**. Nothing here needs you to know how to code; every step is a form
you fill in on a website, and one value you paste into `config.js`.

**Test it right now, with zero setup:** open `components.html` in a browser
(or your Live Server extension), add a part to the cart, and book it. It
already works end-to-end — orders just save to your browser instead of a
shared database until you connect Firebase (Part 5). That's what "demo mode"
banners you'll see mean.

| Part | What it turns on | Cost | Time |
|---|---|---|---|
| [1](#part-1--the-one-file-you-edit) | — (orientation) | — | 1 min |
| [2](#part-2--upi-payments-fastest-one) | Real UPI QR + payment link | Free | 2 min |
| [3](#part-3--razorpay-cards-netbanking-wallets) | Card / netbanking / wallet payment | Free to join¹ | 10 min |
| [4](#part-4--emailjs-booking-confirmation-emails) | Automatic confirmation emails | Free² | 10 min |
| [5](#part-5--firebase-the-shared-order-database) | Cross-device order tracking + technician panel | Free³ | 15 min |
| [6](#part-6--whatsapp-notifications) | WhatsApp notifications | Free | 1 min |
| [7](#part-7--deploying) | Putting it online | Free | 5 min |

¹ Razorpay takes a small % fee per successful payment, no monthly cost.
² EmailJS free tier: ~200 emails/month.
³ Firebase free (Spark) tier: generous daily limits, easily enough for a small shop.

---

## Part 1 — the one file you edit

Every credential lives in **`config.js`**. Open it in any text editor. Each
setting has a comment explaining it. As you complete the parts below, replace
the matching placeholder value and save the file — that's the entire
integration step on your end.

You don't need to do every part, or do them in order. Anything you leave as
the placeholder just shows a friendly "not connected yet" state instead of
breaking.

---

## Part 2 — UPI payments (fastest one)

No signup at all — it's just the UPI ID you already have, linked to GPay,
PhonePe, Paytm, or your bank's app.

1. Open your UPI app → Profile → find "UPI ID" (looks like `yourname@bank`
   or `9876543210@ybl`).
2. In `config.js`, set:
   ```js
   UPI_ID: "yourname@bank",
   UPI_PAYEE_NAME: "Your Shop Name",
   ```
3. Save. Open `checkout.html` with something in the cart — the QR code and
   "Open in UPI app" button now use your real ID.

Money lands straight in your account — no gateway, no fee, nothing else to
configure. The only limitation: there's no automatic "payment received"
signal (see [How payment confirmation works](#how-payment-confirmation-actually-works) below).

---

## Part 3 — Razorpay (cards, netbanking, wallets)

1. Sign up at **razorpay.com** and complete the basic KYC (needed before you
   can go live; you can build and test the button before KYC finishes).
2. In the Razorpay Dashboard, go to **Payment Button** → **+ Create Payment
   Button** → choose **Create Your Own**.
3. Give it a title (internal only, e.g. "Repairo Checkout") and a button
   label (e.g. "Pay Now").
4. Under **Amount Details**, add ONE amount field:
   - Field type: **Customers Decide Amount**
   - Label: `Repair Total`
5. Under **Customer Details**, keep Name, Email and Phone collected — handy
   for cross-checking against your bookings.
6. Save and publish the button (remember: buttons made in **test mode** won't
   appear on your live site — switch to live mode once you're ready for real
   payments).
7. Copy the **Button ID** shown (starts with `pl_`), and the field key —
   Razorpay turns your label into a key by lower-casing it and swapping
   spaces for underscores, so "Repair Total" becomes `repair_total`.
8. In `config.js`:
   ```js
   RAZORPAY_BUTTON_ID: "pl_xxxxxxxxxxxxxx",
   RAZORPAY_AMOUNT_FIELD_KEY: "repair_total",
   ```

The checkout page fills that field with the exact cart total automatically —
you don't need a separate button per price.

---

## Part 4 — EmailJS (booking confirmation emails)

1. Sign up free at **emailjs.com**.
2. **Email Services** → add a service → connect your Gmail/Outlook (or any
   provider they list). Note the **Service ID**.
3. **Email Templates** → create a new template. Use these variables in the
   subject/body — they're filled in automatically for every booking:

   ```
   Subject: Repairo booking confirmed — {{order_id}}

   Hi {{to_name}},

   Your booking is confirmed.

   Order ID: {{order_id}}
   Device: {{device}}
   Items:
   {{items_text}}

   Total: {{total}}
   Payment: {{payment_method}} — {{payment_status}}
   Status: {{status}}

   Track it anytime at our website's Track Repair page.
   — {{shop_name}}
   ```

   Set the template's "To email" field to `{{to_email}}`. Note the
   **Template ID**.
4. **Account** → note your **Public Key**.
5. In `config.js`:
   ```js
   EMAILJS_PUBLIC_KEY: "...",
   EMAILJS_SERVICE_ID: "...",
   EMAILJS_TEMPLATE_ID: "...",
   ```

---

## Part 5 — Firebase (the shared order database)

This is what makes an order bookable on a customer's phone and visible on
your laptop — and what lets you actually change a status and have the
customer see it. Without this, everything still works, but only within one
browser at a time.

### 5.1 — Create the project
1. Go to **console.firebase.google.com** → **Add project** → name it
   (e.g. "repairo") → finish the wizard (Analytics is optional, skip it).
2. In your new project: **Build → Firestore Database → Create database** →
   start in **production mode** → pick a location close to India (e.g.
   `asia-south1`).
3. **Build → Authentication → Get started → Sign-in method → Email/Password
   → Enable**.
4. Still in Authentication, go to the **Users** tab → **Add user** → enter
   the email and password *you* (the shop owner) want to sign in with on
   `technician.html`. This is your only admin login — there's no public
   sign-up form, by design.

### 5.2 — Get your config
1. Project **Settings (gear icon) → General → Your apps → </> (Web)**.
2. Register a nickname (e.g. "repairo-web"), skip Firebase Hosting.
3. Copy the `firebaseConfig` object shown and paste its values into
   `config.js`:
   ```js
   FIREBASE: {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   }
   ```

### 5.3 — Set the security rules
**Firestore Database → Rules**, replace everything with this, then **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow get: if true;
      allow list: if request.auth != null;
      allow create: if request.resource.data.orderId == orderId
                    && request.resource.data.status == "pending";
      allow update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

What this actually does, in plain terms:
- **Anyone can create a booking** (`create`) — that has to be public, or
  customers couldn't book.
- **Anyone can look up ONE order if they know its exact ID** (`get`) — this
  is how `track.html` works. Order IDs are random 6-character codes
  (like `REP-K7X2QP`), not guessable, and tracking also checks the phone
  number matches before showing anything.
- **Only you, signed in, can list every order** (`list`) — this is what
  powers the technician panel, and it's why a stranger can't just browse
  every booking you've ever had.
- **Only you, signed in, can change a status or payment state** (`update`).
- **Nobody can delete an order** (`delete: if false`) — keeps a full history.

Be honest with yourself about what this is: it's real, reasonable protection
for a small shop's own bookings — not bank-grade security. Anyone who somehow
learned an order ID *and* the right phone number could view that one order;
nobody but you can see the full list or change anything.

### 5.4 — Sign in
Open `technician.html`, sign in with the email/password you created in 5.1,
and you'll see every real booking with a status dropdown and a "Notify on
WhatsApp" button.

---

## Part 6 — WhatsApp notifications

Already working once you fill in one line — no signup:

```js
SHOP_WHATSAPP: "919876543210",   // your number, country code, digits only
```

Right after a customer books, their WhatsApp opens with the order pre-filled,
addressed to you — one tap (Send) and you're notified. The tracking page and
technician panel have matching buttons to message the *customer* the same
way.

**Why not fully automatic?** A message that sends itself, with no tap from
anyone, needs the WhatsApp Business Platform — Meta's own Cloud API, or a
reseller like Twilio, AiSensy or Interakt. That requires business
verification and has a per-message cost, and it has to be called from a
server (never from a browser, since it needs a secret access token). It's a
reasonable next step if this grows past what click-to-chat comfortably
handles — happy to help wire that up later if you get there.

---

## Part 7 — Deploying

Unchanged from before — GitHub Pages works exactly the same way with the new
files:

1. Push the whole folder (all `.html`, `.js`, `.css`, `.md` files) to a GitHub
   repository.
2. **Repository → Settings → Pages → Source: Deploy from a branch → Branch:
   main → Folder: / (root) → Save.**
3. Your site is live at `https://YOUR-USERNAME.github.io/repairo-website/`.

One thing to double check post-deploy: `config.js` will be publicly visible
in your site's source (like all front-end code). That's fine for every value
in it *except* — there isn't actually a secret in there. Your Firebase
`apiKey` and Razorpay Button ID are meant to be public; they're not secret
keys. EmailJS's Public Key is, as the name says, meant to be public too. You
never put a *secret*/*private* key from any of these services into this file.

---

## How payment confirmation actually works

Worth understanding clearly: this is a static site with no server, so there's
no way for it to independently verify a payment happened — no site running
purely in the browser can safely hold the credentials needed to ask a bank
"did this payment really arrive?" That verification always needs a backend.

So today, both UPI and Razorpay payments here work the same honest way:
1. The customer pays.
2. They confirm they've paid (a checkbox for UPI; Razorpay shows its own
   payment-success screen and emails the customer a receipt).
3. The order is marked **"awaiting confirmation."**
4. You check your bank/UPI app or Razorpay Dashboard, see the payment
   really arrived, and mark it **paid** in the technician panel.

For a small shop this is completely normal — it's how most small businesses
here already work. If you later want a payment to auto-confirm with zero
manual checking, that needs a small backend (even a single serverless
function) to create Razorpay orders server-side and verify its payment
signature — a reasonable "v2" if this grows.

---

## Changing prices or adding models

Everything catalogue-related — categories, device models, Original/Duplicate
prices, warranty terms — lives in one place: **`catalog-data.js`**. Each item
looks like this:

```js
{ id: "scr-iphone-15", brand: "Apple", model: "iPhone 15 / 15 Plus",
  original: 16999, duplicate: 7999,
  originalWarranty: "12 months", duplicateWarranty: "4 months" }
```

Copy an existing line, change the values, keep the `id` unique. Nothing else
needs to change — prices update everywhere (homepage teaser, catalogue,
cart, checkout, tracking) automatically.

---

## Troubleshooting

- **"Card payments aren't connected yet" on checkout** → `RAZORPAY_BUTTON_ID`
  in `config.js` is still the placeholder. See Part 3.
- **Email note says "EmailJS not configured"** → check `config.js` has all
  three EmailJS values, and that the template's "To email" field is set to
  `{{to_email}}`, not a fixed address.
- **Technician panel: "Couldn't load bookings"** → almost always the
  Firestore rules in Part 5.3 haven't been published yet, or you signed in
  with a different account than the one added in 5.1.
- **Tracking says "we couldn't find a booking"** → double-check the Order ID
  (it's case-insensitive) and that the phone number matches exactly what was
  entered at booking.
- **Orders don't show up on a different device** → Firebase isn't connected
  yet (Part 5) — until then, orders are saved per-browser only, by design.
