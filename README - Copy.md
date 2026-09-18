# REPAIRO — Premium Phone Repair Components

> **Repair better. Pay less.**

Repairo is a **B2B2C premium phone repair components distribution platform** designed to make high-quality smartphone repairs more affordable, reliable, and transparent.

The platform connects **certified component suppliers with skilled repair technicians**, enabling consumers to access quality repair services at a lower cost than authorized service centers.

---

## 🚀 Project Overview

Repairo addresses a common problem in India's smartphone repair ecosystem: consumers often have to choose between expensive authorized service centers and cheaper informal repair options where component quality and warranty can be uncertain.

Repairo aims to bridge this gap by providing:

* Premium, OEM-equivalent repair components
* Competitive pricing
* Manufacturer-backed warranty
* Component authentication
* Technician-focused distribution
* Faster component availability
* Greater transparency for consumers

This website is an **academic product prototype** developed as part of a Marketing Management / Strategic Business Analysis project.

---

## 🆕 What's new: a real commerce layer

On top of the original prototype, the site now has a working — not simulated — path from browsing a part to getting paid and tracked:

* **Priced catalogue** (`components.html`) — every screen, battery, charging port and camera is listed with two honest tiers, **Original** and **Duplicate**, each with its own real starting price and warranty term.
* **Cart & booking checkout** (`checkout.html`) — customers pick parts, fill in their details, and book a repair.
* **Payments** — pay by **UPI** (a real scannable QR built from your own UPI ID, no gateway needed), by **card / netbanking / wallet** (via a Razorpay Payment Button), or choose **pay after service**.
* **Email confirmation** — sent automatically via EmailJS the moment a booking is placed.
* **WhatsApp notifications** — one-tap click-to-chat messages to the shop on every new booking, and from the shop to the customer on every status update.
* **Order status tracking** (`track.html`) — customers look up an order by ID + phone and see a real, live timeline: Pending → Confirmed → In Progress → Completed.
* **Technician admin panel** (`technician.html`) — sign in to see every booking and update its status; customers see the change instantly.

All of this runs in **demo mode** out of the box (orders saved to the browser, nothing sent anywhere) so you can test the whole flow with zero setup. Connect your own free UPI ID, Razorpay, EmailJS and Firebase accounts — see **`SETUP_GUIDE.md`** — and it becomes fully live, with no code changes beyond one config file.

---

## 🎯 Key Value Proposition

### For Consumers

**Premium-quality repairs without the premium service-center price.**

* Save approximately **30–40%** compared with authorized service-center repair
* Access warranty-backed components
* Verify component authenticity
* Extend smartphone lifespan
* Reduce electronic waste

### For Technicians

**Better components. Better margins. Better customer trust.**

* Access to premium repair components
* Competitive wholesale pricing
* Technician loyalty and incentive programs
* Training and certification opportunities
* Faster component availability
* Warranty support

---

## 🛠️ Products

The website currently showcases four major product categories:

### 📱 Screens

Premium replacement displays designed for reliable performance and compatibility.

### 🔋 Batteries

Quality replacement batteries designed to extend device lifespan.

### 🔌 Charging Ports

Replacement charging components for common smartphone repair requirements.

### 📷 Cameras & Components

Camera modules and other supporting components for future product expansion.

---

## ⭐ Why Repairo?

| Feature           | Repairo                             |
| ----------------- | ----------------------------------- |
| Component Quality | Premium / OEM-equivalent            |
| Cost Advantage    | 30–40% lower than authorized repair |
| Warranty          | 12–24 months                        |
| Authentication    | QR / Serial Verification            |
| Distribution      | Technician-enabled                  |
| Delivery Target   | <48 hours                           |
| Primary Customer  | Repair Technicians                  |
| End Beneficiary   | Smartphone Consumers                |

---

## 🔄 How Repairo Works

The Repairo ecosystem follows four simple steps:

### 1. Source

Components are sourced from selected manufacturers and suppliers.

### 2. Verify

Components undergo quality verification and authentication before distribution.

### 3. Repair

Certified technicians use Repairo components to repair customers' smartphones.

### 4. Protect

Customers receive warranty support and can verify their component using its QR/serial information.

---

## 👨‍🔧 Technician Ecosystem

Technicians are a critical part of Repairo's B2B2C business model.

The platform is designed to support technicians through:

* Competitive component pricing
* Loyalty incentives
* Volume-based benefits
* Training and certification
* Warranty assistance
* Faster access to inventory
* Digital ordering
* Performance tracking

The website includes a **technician dashboard prototype** demonstrating how technicians could interact with the Repairo ecosystem.

---

## 🛡️ Quality & Warranty

Trust is one of the key differentiators of the Repairo concept.

The platform proposes:

* Component authentication
* QR-code verification
* Serial-number tracking
* Manufacturer-backed warranty
* Supplier quality audits
* Centralized quality verification

Customers can use the website's **Verify Part** interface as a prototype demonstration of the authentication experience.

> **Note:** Authentication, blockchain tracking, logistics infrastructure, technician dashboards, and warranty systems shown on this website are conceptual features of the academic product prototype and are not connected to a live production backend.

---

## 📊 Market Positioning

Repairo is positioned between:

**Low-cost informal / Chinese components**

and

**Expensive authorized service centers**

The intended positioning is:

> ### **Premium quality at an affordable price.**

This allows Repairo to target customers who are **quality-conscious but price-sensitive**.

---

## 🎯 Target Market

### Primary Target

* Smartphone repair technicians
* Independent repair shops
* Skilled repair professionals

### Consumer Segment

* Smartphone users aged approximately **18–45**
* Post-warranty smartphone owners
* Price-sensitive but quality-conscious consumers
* Users in Tier-1 and Tier-2 Indian cities

---

## 🌱 Mission

> **"To extend smartphone lifespan and accessibility by providing affordable, warranty-backed premium components through India's repair ecosystem, reducing e-waste and empowering the skilled technician workforce."**

---

## 🔭 Vision

> **"India's most trusted alternative to authorized phone repair centers, enabling millions to keep their devices working longer while reducing electronic waste and supporting the skilled technician workforce."**

---

## 💻 Website Features

The current website prototype includes:

* Responsive landing page
* Product catalogue
* Product detail modals
* Product category cards
* "How Repairo Works" section
* Quality & warranty section
* QR/serial verification prototype
* Technician dashboard mockup
* Technician benefits section
* Market positioning visualization
* Mission & vision section
* Partner registration form
* Responsive mobile navigation
* Interactive JavaScript components

---

## 🧰 Technology Stack

This is a lightweight static website built using:

* **HTML5** — Website structure
* **CSS3** — Styling and responsive design
* **JavaScript** — Interactions and UI functionality
* **GitHub Pages** — Website hosting

No backend or database is currently required for the prototype.

---

## 📁 Project Structure

```text
repairo-website/
│
├── index.html          Landing page
├── components.html     Priced catalogue + cart (NEW)
├── checkout.html        Booking + payment + confirmation (NEW)
├── track.html            Real order status lookup (rebuilt)
├── technician.html       Sign-in + live incoming-orders admin panel (rebuilt)
├── diagnose.html         Guided symptom → category diagnosis
├── customer.html         Customer sign-in
├── warranty.html         Component verification
├── style.css              Shared styling for every page
├── script.js               Shared nav / modal / demo-form behaviour
│
├── config.js                Your shop's credentials — the ONE file to edit (NEW)
├── catalog-data.js          Component list & Original/Duplicate pricing (NEW)
├── store.js                  Order data layer: Firebase, or a local demo fallback (NEW)
├── cart.js                    Shopping cart (NEW)
├── payments.js                 UPI QR/link + Razorpay button builder (NEW)
├── notify.js                    EmailJS + WhatsApp click-to-chat helpers (NEW)
├── catalog.js                    components.html page logic (NEW)
├── checkout.js                    checkout.html page logic (NEW)
├── track.js                        track.html page logic (NEW)
├── admin.js                         technician.html admin-panel logic (NEW)
│
├── SETUP_GUIDE.md        Step-by-step: connect your real UPI/Razorpay/Email/Firebase (NEW)
└── README.md              This file
```

### `index.html`, `diagnose.html`, `customer.html`, `warranty.html`

Marketing/prototype pages from the original concept, lightly updated to link into the new booking flow.

### `components.html` + `checkout.html` (new)

The real commerce flow: browse priced parts, build a cart, book a repair, and pay.

### `track.html` + `technician.html` (rebuilt)

Real, two-sided order status tracking: customers look an order up, technicians update it.

### `style.css`

Contains the website's visual design, layout, responsive behaviour, animations, and styling — extended with the catalogue, cart, checkout and admin-panel styles.

### `script.js`

Shared behaviour used by every page: mobile navigation, the homepage product modal, and the original demo forms/diagnosis wizard (now feeding real category data into the new catalogue).

### `config.js`, `catalog-data.js`, `store.js`, `cart.js`, `payments.js`, `notify.js`

The commerce layer's shared logic — see `SETUP_GUIDE.md` for what each one does and how to connect it to real services.

### `README.md` / `SETUP_GUIDE.md`

Project documentation and setup instructions.

---

## ▶️ Run the Website Locally

### Option 1 — VS Code Live Server

1. Download or clone this repository.
2. Open the project folder in **Visual Studio Code**.
3. Install the **Live Server** extension.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. The website will open in your browser.

---

## 🌐 Deploy on GitHub Pages

The website can be deployed for free using GitHub Pages.

### Steps

1. Create a GitHub repository.
2. Upload:

   * `index.html`
   * `style.css`
   * `script.js`
   * `README.md`
3. Open:

**Repository → Settings → Pages**

4. Under **Build and deployment**, select:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

5. Click **Save**.
6. Wait for GitHub Pages to deploy the website.

Your website will then be available at:

```text
https://YOUR-USERNAME.github.io/repairo-website/
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## ⚠️ Academic Prototype Disclaimer

Repairo is an **academic startup/product concept**, now with a genuinely working ordering layer bolted on for demonstration purposes.

**Real, once you connect your own free accounts (see `SETUP_GUIDE.md`):**

* Priced catalogue with Original/Duplicate tiers
* Cart, booking checkout, and order creation
* UPI payment (direct to your own UPI ID) and card/netbanking/wallet payment (via Razorpay)
* Email booking confirmations (via EmailJS)
* WhatsApp click-to-chat notifications, both directions
* Order status tracking, backed by a real shared database (Firebase Firestore)
* A technician sign-in and live order-management panel

**Still conceptual demonstrations, not live infrastructure:**

* QR/serial component authentication and blockchain-style warranty tracking
* Manufacturer/supplier integrations and logistics network
* Formal technician certification, training and payout systems
* Automatic (zero-tap) WhatsApp messages — the current implementation uses free click-to-chat links; fully automatic messages need the paid, business-verified WhatsApp Business Platform

The payment integrations here are real but lightweight: UPI and Razorpay payments are self-confirmed by the customer and reconciled by the shop owner, since a fully automatic bank-verified payment flow needs a backend server, which this static site intentionally doesn't have. See `SETUP_GUIDE.md` for the exact limitations of each piece.

---

## 📚 Project Context

This website was developed to support an academic project covering areas including:

* Marketing Management
* Segmentation, Targeting & Positioning (STP)
* Customer Relationship Management (CRM)
* Product Development
* Design Thinking
* Competitive Analysis
* SWOT Analysis
* PESTEL Analysis
* Porter's Five Forces
* Business Model Canvas
* SERVQUAL
* Market Positioning
* Supply Chain Strategy

---

## 👥 Project

**Project:** Repairo
**Category:** Smartphone Repair Components
**Business Model:** B2B2C
**Market:** India
**Project Type:** Academic / College Project

---

## 📌 Status

**Current Status:** Academic Product Prototype with a working ordering, payment, notification and tracking layer.

Future development could still include:

* Full customer/technician account systems (the current sign-in is a lightweight demo/single-admin gate, not multi-user accounts)
* Live product inventory and stock management
* Automatic (server-verified) payment confirmation, via a small backend or Razorpay webhooks
* Fully automatic WhatsApp messaging via the WhatsApp Business Platform
* QR/serial authentication backend and blockchain-style warranty tracking
* Technician locator, supplier management and logistics network
* Customer feedback and review system

---

## 📄 License

This project is developed for **academic and educational purposes**.

© 2026 Repairo — Academic Product Prototype