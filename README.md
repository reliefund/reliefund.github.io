# Nepal Flood Relief — Frontend Website

A fast, accessible, and transparent static donation website built for an independent community relief initiative supporting families affected by flooding in Nepal.

---

## 1. Project Positioning & Governance

- **Independent Initiative:** This website is deliberately constructed for an independent public relief initiative. It makes **no** claims of being a registered NGO, charity, or government program unless verified legal documentation is supplied.
- **Zero Fabricated Claims:** Contains no fake live donation counters, no fabricated beneficiary numbers, no simulated donor testimonials, and no artificial countdowns.
- **Payment Privacy & Security:** Operates on static frontend principles. Card numbers, CVVs, net banking credentials, or UPI PINs are never collected or stored. All transactions redirect securely to the organizer's hosted Razorpay payment portal.

---

## 2. File & Directory Structure

```text
nepal-flood/
├── index.html                  # Semantic, accessible HTML5 single-page site
├── css/
│   └── style.css               # Design tokens, responsive grid, components & WCAG contrast
├── js/
│   └── main.js                 # Mobile drawer, accessible FAQ, Razorpay modal routing
├── assets/
│   ├── images/
│   │   ├── hero-nepal-flood.jpg # Contextual wide hero image
│   │   ├── relief-food.jpg      # Dry rations & emergency food staging
│   │   ├── clean-water.jpg      # Water filtration & clean water jerrycans
│   │   ├── first-aid.jpg        # Medical first-aid supplies & ORS kits
│   │   └── shelter.jpg          # Waterproof tarpaulins, ropes & blankets
│   ├── icons/                  # SVG icons and visual cues
│   └── image-credits.txt       # Standardized source & license records for images
├── README.md                   # This project runbook and deployment documentation
└── LICENSES-AND-SOURCES.md     # Licensing documentation for all assets
```

---

## 3. How to Run Locally

Because this is a pure static frontend (HTML5, CSS3, vanilla JavaScript), no Node.js build process, database, or backend server is needed.

### Option A: Using Python's Built-in HTTP Server (Recommended)
Open a terminal in the project root (`c:\nepal flood`) and execute:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to: `http://localhost:8000` in your web browser.

### Option B: Using VS Code / Live Server
1. Open the project folder in VS Code or Antigravity IDE.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option C: Direct Browser Opening
You can double-click `index.html` to open it in Chrome, Firefox, Safari, or Edge directly via the `file://` protocol. (Note: Running via a local HTTP server as in Option A is recommended for full fidelity testing of relative paths).

---

## 4. How to Update Content & Configurations

### A. Updating the Razorpay Hosted URL
In `js/main.js`, locate the `RELIEF_CONFIG` constant at line 14:

```javascript
const RELIEF_CONFIG = {
  // Replace with your verified Razorpay Payment Page or Link:
  razorpayHostedUrl: 'https://pages.razorpay.com/your-actual-page-slug',
  ...
};
```
Every Donate button on the page (`.js-donate-btn`) automatically routes through this central configuration.

### B. Updating Initiative & Organizer Information
1. Open `index.html` and search for `[TODO:`:
   - Organizer Name: Replace `[TODO: Organizer / Volunteer Coordination Team]` in the About and Footer sections.
   - Target Region: Replace `[TODO: Verified Flood Districts...]` with the exact river basin or district names.
   - Contact Email: Replace `relief-inquiry@example.org` with the verified organizer email.
   - Phone Helpline: Replace `+977 1-XXXXXXX` with the active hotline.
2. In `js/main.js`, update `contactEmail` and `contactPhone` in `RELIEF_CONFIG`.

### C. Adding New Field Updates
In `index.html`, navigate to `#updates`. Copy an `<article class="update-entry">` block and fill in:
- `<time class="update-entry__date" datetime="YYYY-MM-DD">Formatted Date</time>`
- Verified title, supply counts, and links to digitized receipts or manifests.

### D. Updating or Replacing Images
1. Save optimized `.jpg` or `.webp` images into `assets/images/`.
2. Follow ethical imagery guidelines: Avoid sensationalized distress or unverified claims.
3. Update `assets/image-credits.txt` using the standard format:
   `filename | creator | original source page URL | licence name/URL | download date | attribution text | permission/context notes`

---

## 5. Deployment Options

This website is ready for immediate deployment to any static web hosting provider:

### Deploying to GitHub Pages
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial release of Nepal Flood Relief website"
   ```
2. Push to your GitHub repository.
3. In repository **Settings > Pages**, set the branch to `main` and root directory to `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Deploying to Netlify / Vercel
1. Drag and drop the `nepal flood` folder onto the Netlify drop zone, or link your GitHub repository.
2. Build command: *(leave blank)*
3. Publish directory: `.` (or root)

---

## 6. Architecture Limitations & Security Boundaries

1. **Frontend-Only Architecture:** The site intentionally contains no backend or database. It cannot generate custom server-side Razorpay orders, verify webhooks, or store donor credit cards.
2. **Receipt Verification:** Receipts are issued by Razorpay directly upon successful transaction. The site makes no independent claims of transaction verification.
3. **Refunds:** Refunds are handled manually by the organizer through the Razorpay Dashboard according to the documented refund policy.
