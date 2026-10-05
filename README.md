# CyphrWeb — Main Website

Static site: plain HTML5 + CSS3 + vanilla JavaScript. No frameworks, no build step, no backend.
Open `index.html` directly in a browser, or deploy the folder to any static host.

## Files

| File | Purpose |
|---|---|
| `index.html` | Whole single-page site |
| `style.css` | All styles (design tokens at the top) |
| `script.js` | Content data, rendering, forms, modal |
| `cyphrweb-mark.png` | Logo used in navbar/footer (small, optimised) |
| `favicon.ico`, `apple-touch-icon.png` | Browser / mobile icons |
| `og-image.png` | 1200×630 social-share preview |
| `404.html` | Not-found page (GitHub Pages / Netlify pick it up automatically) |
| `robots.txt`, `sitemap.xml` | SEO |
| `CNAME` | Custom domain for GitHub Pages (`cyphrweb.in`) — delete if not using GitHub Pages |

## One-time setup

1. **Form delivery** — in `script.js`, set `FORM_DELIVERY_EMAIL` to a real inbox.
   Submit any form once on the live site; FormSubmit emails an *Activate* link — click it.
   Until then, entries are only saved on the visitor's own device.
2. **Social links** — in the footer of `index.html`, uncomment the social block and add real URLs
   (also add them to `sameAs` in the JSON-LD in `<head>`).
3. **Analytics (optional)** — uncomment the Plausible line in `<head>` and set your domain.

## Photos (put these files next to `index.html`, same folder, no subfolder)

| File | Person |
|---|---|
| `tejas.png` | Tejas Naiknaware (Founder) |
| `sandesh.png` | Sandesh Shingankar (Co-Founder & COO) |
| `anisha.png` | Anisha Gadagi |
| `shipra.png` | Shipra Saha |
| `moreshwar.png` | Moreshwar Shinde |
| `sharad.png` | Sharad S. Gadhave |
| `mahesh.png` | Mahesh Dhimdhime |
| `sakshi.png` | Sakshi Shreya |

Square photos (about 460x460), face centred near the top, work best. Until a photo is added, the person's initials are shown.
To add another expert, add an entry to the `EXPERTS` array in `script.js`.

## Editing content

- Headline numbers: `STATS` at the top of the data section in `script.js` (used in several places).
- Startups directory: `STARTUPS` array. Events/opportunities: `EVENTS`. Testimonials: `TESTIMONIALS`. Careers: `CAREERS`.
- Empty arrays show friendly "coming soon" blocks automatically.

## Known limitation

"Find a team" listings are stored in each visitor's `localStorage`, so one visitor cannot see another's listing.
Registrations still reach the CyphrWeb team by email once form delivery is set up.
To show a shared public list, connect a backend (e.g. Google Sheets / Firebase) later.

## Adding a product to "Built by CyphrWeb"

Everything lives in `script.js`, in the `PRODUCTS` array (top of the file's data blocks).
Copy one entry, give it a unique `id`, fill in name / founder / category / tags / description /
status / logo / link — the cards, filters, counts, search and "Show more" paging update automatically.
Use `status: 'live'` only when a real working product exists. Leave `link: ''` until a public page
exists (the button then opens a details panel). Change `FEATURED_PRODUCT_ID` to feature a different product.
