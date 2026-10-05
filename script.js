/* =========================================================
   CyphrWeb — Interactions (vanilla JS, no dependencies)
   ========================================================= */

/* ---------------------------------------------------------
   FORM DELIVERY CONFIG
   The site has no backend, so form submissions (Find a Team,
   Startup Application, Talent Registration, Newsletter) are
   saved to localStorage (device-only, as before) AND sent to
   this email via FormSubmit — a free service that needs no
   account, just an inbox.

   SETUP (one-time, takes 2 minutes):
   1. Replace the email below with a real CyphrWeb inbox.
   2. Submit any form on the live site once — FormSubmit sends
      that inbox a confirmation email with an "Activate" link.
      Click it. After that, every future submission arrives by
      email automatically — no code changes needed.
   Until this is set up, submissions still work exactly as
   before (saved on the visitor's device only).
   --------------------------------------------------------- */
const FORM_DELIVERY_EMAIL = 'your-email@example.com'; // <-- replace with your real inbox

/* Returns 'sent' (FormSubmit accepted it), 'local' (delivery not configured,
   entry only saved on this device) or 'failed' (network/service error). */
async function deliverFormSubmission(formName, entry) {
  if (!FORM_DELIVERY_EMAIL || FORM_DELIVERY_EMAIL === 'your-email@example.com') return 'local';
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORM_DELIVERY_EMAIL)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: `CyphrWeb website — ${formName}`, _captcha: 'false', ...entry }),
    });
    return res.ok ? 'sent' : 'failed';
  } catch (err) {
    /* Delivery failed (offline, blocked, etc.) — the localStorage copy still has the entry */
    console.error('CyphrWeb: form delivery failed', err);
    return 'failed';
  }
}

/* Shared helpers for the forms */
const DELIVERY_FAIL_MSG =
  "We saved this on your device but couldn't reach our team. Please also message us in the community group.";

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}
function isValidContact(v) {
  // email OR a phone number with 10-15 digits (spaces, +, -, brackets allowed)
  if (isValidEmail(v)) return true;
  const digits = v.replace(/[\s()+-]/g, '');
  return /^\d{10,15}$/.test(digits);
}
function isBot(data) {
  // Honeypot field: real visitors never see or fill it
  return !!(data.get('_honey') || '').toString().trim();
}
/* Runs delivery in the background and swaps the note text if it fails */
function deliverAndReport(formName, entry, note, successMsg) {
  if (note) note.textContent = successMsg;
  deliverFormSubmission(formName, entry).then((status) => {
    if (status === 'failed' && note) note.textContent = DELIVERY_FAIL_MSG;
  });
}

/* ---------------------------------------------------------
   DATA
   These arrays are the site's content for the directory,
   events and careers sections. Edit them directly to add,
   remove or update entries — no build step required.
   Startup ideas are intentionally NOT stored here in detail;
   only a high-level focus area is shown publicly.
   --------------------------------------------------------- */

// Add real startups here as they join. Leave empty until then —
// no placeholder companies are shown.
const STARTUPS = [
  // Example shape (copy this to add a real entry):
  // {
  //   name: "Startup Name",
  //   founders: "Founder A, Founder B",
  //   stage: "MVP Stage",
  //   focusArea: "Campus logistics",
  //   story: "How the team started — a couple of sentences.",
  //   photo: null // optional image path, e.g. "assets/startups/name.jpg"
  // }
];

// Add real, upcoming events here. Leave empty until there's
// something on the calendar — no invented dates or numbers.
const EVENTS = [
  {
    title: "CyphrWeb Hackathon 2026",
    type: "Hackathon",
    start: "2026-04-23", end: "2026-08-01",
    date: "23 Apr – 1 Aug 2026",
    mode: "100% online · GitHub-based",
    badge: "Hackathon",
    big: "₹10K", bigLabel: "prize pool",
    chips: ["Teams of 2–4", "3 execution days", "₹299 per team"],
    summary: "No PPT, only execution. Build real solutions in prototype, 3-day sprint and 24-hour final rounds.",
    embed: "https://cyphrweb.github.io/h/",
    tab: "CyphrWeb Hackathon"
  },
  {
    title: "vector.io Hackathon – NMIET",
    type: "Hackathon",
    start: "2026-04-06", end: "2026-04-30",
    date: "6 – 30 Apr 2026",
    mode: "Online rounds + on-campus finale",
    badge: "Hackathon",
    big: "₹50K+", bigLabel: "prize pool",
    chips: ["IT Dept, NMIET Talegaon", "24-hour grand finale", "₹349 per team"],
    summary: "Remote sprints, then a non-stop 24-hour coding finale at the NMIET auditorium.",
    embed: "https://cyphrweb.github.io/vector/",
    tab: "vector.io Hackathon"
  }
];

const CAREERS = [
  {
    title: "Content & Community",
    blurb: "Help run the WhatsApp community, write updates, and keep members engaged.",
  },
  {
    title: "Tech & Product",
    blurb: "Build and improve CyphrWeb's own tools — the website, dashboards and internal systems.",
  },
  {
    title: "Design",
    blurb: "Shape how CyphrWeb looks and feels — from the site to event branding.",
  },
  {
    title: "Partnerships & Outreach",
    blurb: "Connect with colleges, mentors and potential partners across Pune's startup scene.",
  },
  {
    title: "Events & Operations",
    blurb: "Plan and run hackathons, workshops and community meetups end to end.",
  },
  {
    title: "Growth & Marketing",
    blurb: "Grow CyphrWeb's reach — social, content and campus ambassadors.",
  },
];

// Add real testimonials as they come in. Leave empty until then —
// no placeholder quotes are shown.
const TESTIMONIALS = [
  // Example shape (copy this to add a real entry):
  // {
  //   quote: "What they actually said, in their own words.",
  //   name: "Person Name",
  //   role: "Founder, Startup Name", // or "Mentor", "Community Member", etc.
  // }
];

// Short summary + fuller details for the "Not just an idea" section —
// each card opens the same modal used elsewhere on the site.
// Single source of truth for the headline numbers used across the site.
// Change a value here and every place that shows it updates (HTML keeps the same
// defaults as a fallback if JavaScript is off).
const STATS = {
  startups: '10+',
  revenue: '2',
  mentors: '20+',
  investors: '5+',
  devs: '10+',
  marketing: '5+',
  community: '300+',
  cwEvents: '2+',
};

const TRACTION = [
  {
    title: "Startups & colleges",
    summary: `${STATS.startups} startups from colleges across India — ${STATS.revenue} already generating revenue.`,
    details:
      `Student teams have registered from colleges across India — including VIT Vellore, MIT and other reputed institutions. Of these, ${STATS.revenue} startups are already generating revenue, with more building toward it.`,
  },
  {
    title: "The team behind it",
    summary: `${STATS.mentors} expert mentors, a ${STATS.devs} member developer team and a ${STATS.marketing} member marketing team.`,
    details:
      `CyphrWeb is run with support from ${STATS.mentors} experienced professionals who mentor the community, including people from companies like Microsoft, BMW, Tata Motors and Capgemini. Alongside them, a ${STATS.devs} member developer team and a ${STATS.marketing} member marketing team — students from our own college — help build and grow the startups on the platform.`,
  },
  {
    title: "Backing us",
    summary: `${STATS.investors} angel investors back startups registered with CyphrWeb.`,
    details:
      `CyphrWeb works with ${STATS.investors} angel investors who invest in the startups registered with CyphrWeb — helping founders access funding as they grow, not just mentorship and resources.`,
  },
];

// Expert profiles. Photos are flat files in the project root (e.g. anisha.png).
// To add someone: drop their photo next to index.html and add an entry here.
// If a photo is missing, their initials are shown instead of a broken image.
const EXPERTS = [
  {
    photo: 'anisha.png',
    name: 'Anisha Gadagi',
    role: 'Software Engineer',
    company: 'Microsoft',
    skills: ['Full-Stack Development', 'React, JS & .NET', 'Microsoft Azure & Cloud', 'AI & Machine Learning'],
  },
  {
    photo: 'shipra.png',
    name: 'Shipra Saha',
    role: 'Software Engineer',
    company: 'Microsoft',
    skills: ['AI-Powered Copilot & Agent Technologies', 'Software Development & Automation', 'System Design & DSA', 'React, JS & Full-Stack'],
  },
  {
    photo: 'moreshwar.png',
    name: 'Moreshwar Shinde',
    role: 'Sr. Full Stack Engineer',
    company: 'BMW Techworks India',
    skills: ['Full Stack Development', 'Modern Web Technologies', 'Scalable Software Architecture', 'Backend & Frontend Engineering'],
  },
  {
    photo: 'sharad.png',
    name: 'Sharad S. Gadhave',
    role: 'Senior Manager — Advanced Quality & Production, Powertrain Division',
    company: 'Tata Motors',
    skills: ['Advanced Quality & Production', 'Powertrain Manufacturing', 'Operations Excellence', 'Lean & Kaizen'],
  },
  {
    photo: 'mahesh.png',
    name: 'Mahesh Dhimdhime',
    role: 'Consultant',
    company: 'Capgemini',
    skills: ['Digital Transformation', 'Enterprise Consulting', 'Software Engineering', 'Business & Technology Solutions'],
  },
  {
    photo: 'sakshi.png',
    name: 'Sakshi Shreya',
    role: 'Software Engineer',
    company: 'Microsoft',
    skills: ['Multi-agent Systems', 'Agentic AI', 'Large Language Models (LLM)', 'Cloud & Scalable Solutions'],
  },
];

const OFFERS = [
  {
    title: "Strategy",
    summary: "Business models, validation, positioning and growth strategy.",
    details:
      "We help you pressure-test your business model, figure out who you're really building for, and set a realistic path from where you are to your next milestone — not a generic template, a plan shaped around your specific startup.",
    icon: "target",
  },
  {
    title: "Expert Guidance",
    summary: "Access to relevant knowledge and experienced people.",
    details:
      "You get direct access to people who've dealt with the exact problem you're facing right now — whether that's technical architecture, hiring your first team, or handling a tricky customer conversation.",
    icon: "bulb",
  },
  {
    title: "Technology",
    summary: "Product development and technical execution.",
    details:
      "From MVP to a production-ready product — CyphrWeb can plug in technical execution support so you're not blocked waiting to hire, or stuck building everything solo.",
    icon: "code",
  },
  {
    title: "Marketing",
    summary: "Branding, content, campaigns and customer acquisition.",
    details:
      "Positioning, brand identity, content and acquisition campaigns — built to get your first real users and keep them, not just look good in a deck.",
    icon: "megaphone",
  },
  {
    title: "Networking",
    summary: "Connections with founders, experts and ecosystem members.",
    details:
      "Warm introductions inside the CyphrWeb community — other founders solving adjacent problems, experts in your domain, and collaborators who can move faster with you.",
    icon: "network",
  },
  {
    title: "Investor Introductions",
    summary: "Relevant introductions to angel investors and investors where appropriate.",
    details:
      "When you're ready and it's the right fit, we make relevant introductions to angel investors in our network. This isn't guaranteed funding — it's a warmer door than a cold email.",
    icon: "handshake",
  },
  {
    title: "Growth",
    summary: "Support focused on traction, customers and scaling.",
    details:
      "Once you have something working, the focus shifts to traction — retention, repeat customers, and the operational muscle you need to scale without breaking.",
    icon: "growth",
  },
];

const ICONS = {
  target:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>',
  bulb:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z"/></svg>',
  code:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="m9 8-4 4 4 4M15 8l4 4-4 4"/></svg>',
  megaphone:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M3 11v2a2 2 0 0 0 2 2h1l3 5V6l-3 5H5a2 2 0 0 0-2 2Z"/><path d="M13 8a4 4 0 0 1 0 8M17 5a8 8 0 0 1 0 14"/></svg>',
  network:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M7.7 7.3 10.5 16M16.3 7.3 13.5 16M8 6h8"/></svg>',
  handshake:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M2 12h4l3-3 3 3 3-3 3 3h4"/><path d="M8 12v4M16 12v4"/></svg>',
  growth:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M4 19h16M6 16l4-5 3 3 5-7"/></svg>',
};

/* ---------------------------------------------------------
   PRODUCTS ECOSYSTEM  ("Built by CyphrWeb")
   ---------------------------------------------------------
   HOW TO ADD A PRODUCT: copy one object in PRODUCTS, give it a unique `id`
   and fill in the fields. Nothing else in the HTML/CSS/JS needs to change.

     id          unique slug (used for the featured pick and the modal)
     name        product / startup name
     founder     founder or team name
     category    label shown on the card (free text)
     tags        which filter tabs it appears under (any of PRODUCT_CATEGORIES)
     description short description (1-2 sentences)
     status      'live' | 'building' | 'prototype' | 'early'
     logo        optional image path (flat file, e.g. 'workwala.png');
                 leave '' to get a generated logo from the name
     link        product URL; leave '' until a real page exists
                 (the button then opens a details panel instead)
     features    optional list of key features (shown in the featured card + details)
     roadmap     optional list shown as "Can expand into" chips

   Only mark a product 'live' if a working live product exists.
   To change the featured product, edit FEATURED_PRODUCT_ID.
   --------------------------------------------------------- */
const FEATURED_PRODUCT_ID = 'beauty-verification';
const PRODUCTS_PAGE_SIZE = 9; // cards shown before "Show more"
const PRODUCT_CATEGORIES = ['EdTech', 'PropTech', 'GovTech', 'HealthTech', 'Employment', 'Consumer Tech', 'Management', 'Other'];
const PRODUCT_STATUS = {
  live:      { icon: '🟢', label: 'Live' },
  building:  { icon: '🚀', label: 'Building' },
  prototype: { icon: '🧪', label: 'Prototype' },
  early:     { icon: '🔥', label: 'Early Stage' }
};

const PRODUCTS = [
  {
    id: 'beauty-verification',
    name: 'Beauty Product Verification',
    founder: 'Sanika Sawat & Team',
    category: 'Consumer Safety / E-Commerce / Product Verification',
    tags: ['Consumer Tech'],
    description: 'Helps users verify beauty and cosmetic products before they buy or use them — designed from day one as a broader product verification ecosystem.',
    status: 'early',
    logo: '',
    link: '',
    features: [
      'Verify beauty and cosmetic products before purchasing or using them',
      'Built as one verification engine that can serve many product categories',
      'Clear, consumer-friendly results focused on safety and trust'
    ],
    roadmap: ['Cosmetics & Beauty', 'Clothes / Fashion', 'Medicines', 'Electronics', 'Food Products', 'Personal Care', 'Other Consumer Products']
  },
  {
    id: 'gfm-management',
    name: 'GFM Management System',
    founder: 'Kiran Rathod',
    category: 'Management / EdTech / Institution Management',
    tags: ['Management', 'EdTech'],
    description: 'A platform designed to simplify management, operations and digital workflows for institutions.',
    status: 'prototype',
    logo: '',
    link: '',
    features: ['Simplifies day-to-day management and operations', 'Moves manual institutional workflows online']
  },
  {
    id: 'society-management',
    name: 'Society Management Platform',
    founder: 'Yogesh Gangasagare',
    category: 'PropTech / Society Management',
    tags: ['PropTech', 'Management'],
    description: 'A digital platform that helps residential societies manage residents, staff, communication, complaints, notices, maintenance and other operations.',
    status: 'building',
    logo: '',
    link: '',
    features: ['Residents and staff management', 'Notices and communication', 'Complaints and maintenance tracking']
  },
  {
    id: 'career-navigator',
    name: 'Career Navigator',
    founder: 'Rohan Wayal',
    category: 'EdTech / Career Guidance',
    tags: ['EdTech'],
    description: 'Helps students and job seekers discover suitable career paths, skills, opportunities, courses and career guidance.',
    status: 'early',
    logo: '',
    link: '',
    features: ['Career path discovery', 'Skills, courses and opportunities in one place']
  },
  {
    id: 'attendance-management',
    name: 'Attendance Management Platform',
    founder: 'Teena',
    category: 'EdTech / Management',
    tags: ['EdTech', 'Management'],
    description: 'A digital attendance solution that simplifies attendance tracking, monitoring, records and reporting.',
    status: 'early',
    logo: '',
    link: '',
    features: ['Attendance tracking and monitoring', 'Records and reporting']
  },
  {
    id: 'government-knowledge-hub',
    name: 'Government Knowledge Hub',
    founder: 'Amol',
    category: 'GovTech / Information Platform',
    tags: ['GovTech'],
    description: 'A centralized platform that makes government information, schemes, services, benefits and resources easier for citizens to discover and understand.',
    status: 'building',
    logo: '',
    link: '',
    features: ['Schemes, services and benefits in one place', 'Plain-language discovery for citizens']
  },
  {
    id: 'workwala',
    name: 'WorkWala',
    founder: 'Pranav Naikude',
    category: 'Employment / LabourTech / Job Platform',
    tags: ['Employment'],
    description: 'Helps workers and labourers find suitable job opportunities and connect with employers — built for people traditional job portals do not reach.',
    status: 'early',
    logo: '',
    link: '',
    features: ['Easy job discovery for workers', 'Direct connection with employers']
  }
];

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Each init runs independently — if one fails, the rest of the
  // page (and its content) still renders instead of going blank.
  safeRun(initNavbarScroll);
  safeRun(initMobileNav);
  safeRun(initScrollReveal);
  safeRun(initBackToTop);
  safeRun(buildNodeGraph);

  safeRun(renderStats);
  safeRun(renderTraction);
  safeRun(renderOffers);
  safeRun(renderExperts);
  safeRun(initPhotoFallbacks);
  safeRun(renderDirectory);
  safeRun(renderProducts);
  safeRun(renderTestimonials);
  safeRun(renderEvents);
  safeRun(initStage);
  safeRun(initEventsFilters);
  safeRun(renderCareers);

  safeRun(initModal);
  safeRun(initFindTeam);
  safeRun(initStartupForm);
  safeRun(initTalentForm);
  safeRun(initNewsletter);
});

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.error(`CyphrWeb: ${fn.name} failed`, err);
  }
}

/* ---------- Navbar background on scroll ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile hamburger nav ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.focus();
    }
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  // Only elements that are successfully armed get the hidden
  // starting state (see .reveal-armed in style.css); anything
  // the observer can't reach simply stays visible.
  items.forEach((el) => {
    el.classList.add('reveal-armed');
    observer.observe(el);
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('is-visible', window.scrollY > 480), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Hero node graph ---------- */
function buildNodeGraph() {
  const svg = document.querySelector('.node-graph');
  const nodesGroup = document.getElementById('nodeDots');
  const linesGroup = document.getElementById('nodeLines');
  if (!svg || !nodesGroup || !linesGroup) return;

  const nodes = Array.from(nodesGroup.querySelectorAll('.node'));
  const center = nodes.find((n) => n.classList.contains('node--center'));
  const outer = nodes.filter((n) => n !== center);

  const getXY = (el) => ({
    x: parseFloat(getComputedStyle(el).getPropertyValue('--x')) || 0,
    y: parseFloat(getComputedStyle(el).getPropertyValue('--y')) || 0,
  });

  const centerPos = getXY(center);
  outer.forEach((node, i) => {
    const pos = getXY(node);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerPos.x);
    line.setAttribute('y1', centerPos.y);
    line.setAttribute('x2', pos.x);
    line.setAttribute('y2', pos.y);
    line.style.opacity = '0';
    line.style.transition = `opacity .5s ease ${0.15 * i}s`;
    linesGroup.appendChild(line);
    requestAnimationFrame(() => (line.style.opacity = '1'));
  });

  nodes.forEach((node) => {
    const pos = getXY(node);
    node.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    const label = node.getAttribute('data-label');
    if (label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const isCenter = node.classList.contains('node--center');
      text.setAttribute('x', '0');
      text.setAttribute('y', isCenter ? '26' : '20');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.style.fontSize = '12px';
      text.style.fill = 'var(--text-muted)';
      text.textContent = label;
      node.appendChild(text);
    }
  });
}

/* ---------------------------------------------------------
   Traction & team cards ("Not just an idea")
   --------------------------------------------------------- */
function renderStats() {
  document.querySelectorAll('[data-stat]').forEach((el) => {
    const key = el.getAttribute('data-stat');
    if (STATS[key] != null) el.textContent = STATS[key];
  });
}

function renderTraction() {
  const grid = document.getElementById('tractionGrid');
  if (!grid) return;

  grid.innerHTML = TRACTION.map(
    (item, i) => `
    <button class="traction-card" type="button" data-traction-index="${i}">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <span class="offer-card__tap">Tap for the full picture →</span>
    </button>`
  ).join('');

  grid.querySelectorAll('[data-traction-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const item = TRACTION[Number(card.getAttribute('data-traction-index'))];
      openModal(`
        <span class="modal__badge">CyphrWeb today</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.details)}</p>
      `);
    });
  });
}

/* ---------------------------------------------------------
   Offer cards ("What CyphrWeb Brings")
   --------------------------------------------------------- */
function renderOffers() {
  const grid = document.getElementById('offerGrid');
  if (!grid) return;

  grid.innerHTML = OFFERS.map(
    (offer, i) => `
    <button class="offer-card" type="button" data-offer-index="${i}">
      <span class="offer-card__photo">${ICONS[offer.icon] || ''}</span>
      <span class="offer-card__body">
        <h3>${escapeHtml(offer.title)}</h3>
        <p>${escapeHtml(offer.summary)}</p>
        <span class="offer-card__tap">Tap to see what this looks like →</span>
      </span>
    </button>`
  ).join('');

  grid.querySelectorAll('[data-offer-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const offer = OFFERS[Number(card.getAttribute('data-offer-index'))];
      openModal(`
        <span class="modal__badge">What CyphrWeb brings</span>
        <h3>${escapeHtml(offer.title)}</h3>
        <p>${escapeHtml(offer.details)}</p>
      `);
    });
  });
}

/* ---------------------------------------------------------
   Expert profile cards ("Meet the Experts")
   --------------------------------------------------------- */
function getInitials(name) {
  return String(name || '')
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function renderExperts() {
  const grid = document.getElementById('expertGrid');
  if (!grid || !EXPERTS.length) return;

  grid.innerHTML = EXPERTS.map(
    (x, i) => `
    <article class="expert-card">
      <span class="expert-card__num">${String(i + 1).padStart(2, '0')}</span>
      <div class="expert-card__top">
        <span class="expert-card__photo">
          <img src="${escapeHtml(x.photo)}" alt="${escapeHtml(x.name)}, ${escapeHtml(x.role)} at ${escapeHtml(x.company)}" width="96" height="96" loading="lazy" data-initials="${escapeHtml(getInitials(x.name))}">
        </span>
        <div class="expert-card__who">
          <h4>${escapeHtml(x.name)}</h4>
          <span class="expert-card__role">${escapeHtml(x.role)}</span>
          <span class="expert-card__company">${escapeHtml(x.company)}</span>
        </div>
      </div>
      <ul class="expert-card__skills">
        ${x.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
      </ul>
    </article>`
  ).join('');
}

/* If a photo file is missing, show the person's initials instead of a broken image */
function initPhotoFallbacks() {
  document.querySelectorAll('img[data-initials]').forEach((img) => {
    const swap = () => {
      if (!img.isConnected) return;
      const span = document.createElement('span');
      span.className = 'photo-fallback';
      span.textContent = img.getAttribute('data-initials') || '';
      span.setAttribute('role', 'img');
      span.setAttribute('aria-label', img.getAttribute('alt') || '');
      img.replaceWith(span);
    };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) swap();
  });
}

/* ---------------------------------------------------------
   Startup directory
   --------------------------------------------------------- */
function renderDirectory() {
  const grid = document.getElementById('directoryGrid');
  const empty = document.getElementById('directoryEmpty');
  if (!grid || !empty) return;

  if (!STARTUPS.length) {
    grid.style.display = 'none';
    empty.style.display = '';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';

  grid.innerHTML = STARTUPS.map(
    (s, i) => `
    <button class="tile-card" type="button" data-startup-index="${i}">
      <span class="tile-card__photo" style="${s.photo ? `background-image:url('${encodeURI(String(s.photo)).replace(/'/g, '%27')}');background-size:cover;background-position:center;` : ''}">
        <span class="tile-card__badge">${escapeHtml(s.stage)}</span>
      </span>
      <span class="tile-card__body">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.focusArea)}</p>
        <span class="tile-card__meta">${escapeHtml(s.founders)}</span>
      </span>
    </button>`
  ).join('');

  grid.querySelectorAll('[data-startup-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const s = STARTUPS[Number(card.getAttribute('data-startup-index'))];
      openModal(`
        <span class="modal__badge">${escapeHtml(s.stage)}</span>
        <h3>${escapeHtml(s.name)}</h3>
        <ul>
          <li>Founders: ${escapeHtml(s.founders)}</li>
          <li>Focus area: ${escapeHtml(s.focusArea)}</li>
        </ul>
        <p>${escapeHtml(s.story)}</p>
        <p class="fineprint">Full product details stay private with the founding team.</p>
      `);
    });
  });
}

/* ---------------------------------------------------------
   Testimonials
   --------------------------------------------------------- */
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  const empty = document.getElementById('testimonialsEmpty');
  if (!grid || !empty) return;

  if (!TESTIMONIALS.length) {
    grid.style.display = 'none';
    empty.style.display = '';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';

  grid.innerHTML = TESTIMONIALS.map(
    (t) => `
    <div class="testimonial-card">
      <p class="testimonial-card__quote">${escapeHtml(t.quote)}</p>
      <span class="testimonial-card__name">${escapeHtml(t.name)}</span>
      <span class="testimonial-card__role">${escapeHtml(t.role)}</span>
    </div>`
  ).join('');
}

/* ---------------------------------------------------------
   Events + Opportunities
   --------------------------------------------------------- */
let currentEventFilter = 'all';

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  const empty = document.getElementById('eventsEmpty');
  if (!grid || !empty) return;

  const filtered =
    currentEventFilter === 'all' ? EVENTS : EVENTS.filter((e) => e.type === currentEventFilter);

  if (!filtered.length) {
    grid.style.display = 'none';
    empty.style.display = '';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';

  grid.innerHTML = filtered.map((e) => {
    const st = eventStatus(e);
    return `
    <button class="tile-card tile-card--event" type="button" data-event-index="${EVENTS.indexOf(e)}">
      <span class="tile-card__photo">
        ${e.big ? `<span class="tile-card__big"><b>${escapeHtml(e.big)}</b><small>${escapeHtml(e.bigLabel || '')}</small></span>` : ''}
        <span class="tile-card__badge">${escapeHtml(e.badge)}</span>
        ${st ? `<span class="status status--${st.key}">${st.label}</span>` : ''}
      </span>
      <span class="tile-card__body">
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.summary)}</p>
        ${e.chips ? `<span class="chips">${e.chips.map((c) => `<span>${escapeHtml(c)}</span>`).join('')}</span>` : ''}
        <span class="tile-card__meta">${escapeHtml(e.date)} · ${escapeHtml(e.mode)}</span>
        ${e.embed ? '<span class="tile-card__cta">Open the live site below</span>' : ''}
      </span>
    </button>`;
  }).join('');

  grid.querySelectorAll('[data-event-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const i = Number(card.getAttribute('data-event-index'));
      const e = EVENTS[i];
      if (e.embed && window.showStage) { window.showStage(e.embed, true); return; }
      openModal(`
        <span class="modal__badge">${escapeHtml(e.badge)}</span>
        <h3>${escapeHtml(e.title)}</h3>
        <ul>
          <li>${escapeHtml(e.date)}</li>
          <li>${escapeHtml(e.mode)}</li>
        </ul>
        <p>${escapeHtml(e.details || e.summary)}</p>
        ${e.link ? `<a class="btn btn--primary" href="${escapeHtml(e.link)}" target="_blank" rel="noopener">${escapeHtml(e.linkLabel || 'Learn more')}</a>` : ''}
      `);
    });
  });
}

function eventStatus(e) {
  if (!e.start || !e.end) return null;
  const now = Date.now();
  if (now < new Date(e.start).getTime()) return { key: 'soon', label: 'Upcoming' };
  if (now > new Date(e.end).getTime() + 864e5) return { key: 'done', label: 'Ended' };
  return { key: 'live', label: 'Live now' };
}

/* Live site stage: embeds each hackathon site in a large iframe */
function initStage() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const items = EVENTS.filter((e) => e.embed);
  if (!items.length) { stage.hidden = true; return; }

  const tabsEl = stage.querySelector('.stage__tabs');
  const frame = stage.querySelector('iframe');
  const url = stage.querySelector('.stage__url');
  const slow = stage.querySelector('.stage__slow');
  const bExpand = stage.querySelector('[data-act="expand"]');
  const bReload = stage.querySelector('[data-act="reload"]');
  const bOpen = stage.querySelector('[data-act="open"]');
  let current = items[0].embed, loadedSrc = '', timer;

  tabsEl.innerHTML = items.map((e) =>
    `<button type="button" role="tab" data-src="${escapeHtml(e.embed)}">${escapeHtml(e.tab || e.title)}</button>`).join('');

  function load(force) {
    if (!force && loadedSrc === current) return;
    loadedSrc = current;
    stage.classList.add('is-loading');
    slow.hidden = true;
    clearTimeout(timer);
    timer = setTimeout(() => { slow.hidden = false; }, 10000);
    frame.src = current;
  }
  frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    clearTimeout(timer);
    stage.classList.remove('is-loading');
    slow.hidden = true;
  });

  function select(src, noLoad) {
    current = src;
    tabsEl.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.src === src;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
    url.textContent = src.replace('https://', '');
    bOpen.href = src;
    if (!noLoad) load(false);
  }
  tabsEl.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (b) select(b.dataset.src);
  });

  function setExpanded(on) {
    stage.classList.toggle('is-full', on);
    bExpand.setAttribute('aria-pressed', on);
    bExpand.textContent = on ? 'Exit full screen' : 'Full screen';
    document.body.style.overflow = on ? 'hidden' : '';
  }
  bExpand.addEventListener('click', () => setExpanded(!stage.classList.contains('is-full')));
  bReload.addEventListener('click', () => load(true));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && stage.classList.contains('is-full')) setExpanded(false);
  });

  window.showStage = (src, scroll) => {
    select(src);
    if (scroll) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  select(current, true);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries.some((x) => x.isIntersecting)) { load(false); obs.disconnect(); }
    }, { rootMargin: '500px' }).observe(stage);
  } else {
    load(false);
  }
}

function initEventsFilters() {
  const tabs = document.querySelectorAll('#eventsFilters .events-filters__tab');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      currentEventFilter = tab.getAttribute('data-filter');
      renderEvents();
    });
  });
}

/* ---------------------------------------------------------
   Careers
   --------------------------------------------------------- */
function renderCareers() {
  const grid = document.getElementById('careersGrid');
  if (!grid) return;

  grid.innerHTML = CAREERS.map(
    (c) => `
    <div class="card career-card">
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.blurb)}</p>
      <a class="career-card__cta" href="https://chat.whatsapp.com/FMRIkeHuOK45pKjLTabjZZ" target="_blank" rel="noopener">Interested? Reach out →</a>
    </div>`
  ).join('');
}

/* ---------------------------------------------------------
   Modal
   --------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  if (!modal || !backdrop || !closeBtn) return;

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      // Keep keyboard focus inside the open dialog
      const focusables = modal.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

let lastFocusedBeforeModal = null;

function openModal(html) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;
  lastFocusedBeforeModal = document.activeElement;
  body.innerHTML = html;
  const heading = body.querySelector('h3');
  if (heading) heading.id = 'modalTitle'; // labels the dialog for screen readers
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
    lastFocusedBeforeModal.focus();
  }
  lastFocusedBeforeModal = null;
}

/* ---------------------------------------------------------
   Find Your Team — registration + local directory
   --------------------------------------------------------- */
const TEAM_STORAGE_KEY = 'cyphrweb_team_requests';

function initFindTeam() {
  const tabs = document.querySelectorAll('.find-team__tab');
  const lookingForLabel = document.getElementById('tf-lookingfor-label');
  const lookingForInput = document.getElementById('tf-lookingfor');
  const form = document.getElementById('teamForm');
  const note = document.getElementById('teamFormNote');
  let currentRole = 'founder';

  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentRole = tab.getAttribute('data-role');
        if (lookingForLabel && lookingForInput) {
          if (currentRole === 'founder') {
            lookingForLabel.textContent = 'Looking for';
            lookingForInput.placeholder = 'e.g. Tech co-founder';
          } else {
            lookingForLabel.textContent = 'Role you want';
            lookingForInput.placeholder = 'e.g. Co-founder, Frontend dev';
          }
        }
      });
    });
  }

  renderTeamList();

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (isBot(data)) return;
    const entry = {
      role: currentRole,
      name: (data.get('name') || '').toString().trim(),
      lookingFor: (data.get('lookingFor') || '').toString().trim(),
      skills: (data.get('skills') || '').toString().trim(),
      pitch: (data.get('pitch') || '').toString().trim(),
      contact: (data.get('contact') || '').toString().trim(),
      ts: Date.now(),
    };

    if (!entry.name || !entry.lookingFor || !entry.skills || !entry.contact) {
      if (note) note.textContent = 'Please fill in all required fields.';
      return;
    }
    if (!isValidContact(entry.contact)) {
      if (note) note.textContent = 'Please enter a valid email or phone number.';
      return;
    }

    const list = readTeamList();
    list.unshift(entry);
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* localStorage unavailable — entry still shows for this session via render below */
    }

    renderTeamList(list);
    form.reset();
    deliverAndReport('Find a Team', entry, note, "You're on the list. Share it in the community so people can see it too.");

    window.open('https://chat.whatsapp.com/FMRIkeHuOK45pKjLTabjZZ', '_blank', 'noopener');
  });
}

function readTeamList() {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function renderTeamList(preloaded) {
  const listEl = document.getElementById('teamList');
  if (!listEl) return;
  const list = preloaded || readTeamList();

  if (!list.length) {
    listEl.innerHTML = `<li class="find-team__empty">No listings saved on this device yet. Register and your entry appears here.</li>`;
    return;
  }

  listEl.innerHTML = list
    .map(
      (entry) => `
    <li class="find-team__entry">
      <div class="find-team__entry-top">
        <span class="find-team__entry-name">${escapeHtml(entry.name)}</span>
        <span class="find-team__entry-role">${entry.role === 'founder' ? 'Founder' : 'Looking to join'}</span>
      </div>
      <p>Looking for: ${escapeHtml(entry.lookingFor)} · Skills: ${escapeHtml(entry.skills)}</p>
      ${entry.pitch ? `<p>${escapeHtml(entry.pitch)}</p>` : ''}
      <p class="fineprint">Contact: ${escapeHtml(entry.contact)}</p>
    </li>`
    )
    .join('');
}

/* ---------------------------------------------------------
   Startup Application Form
   --------------------------------------------------------- */
const STARTUP_APP_STORAGE_KEY = 'cyphrweb_startup_applications';

function initStartupForm() {
  const form = document.getElementById('startupForm');
  const note = document.getElementById('startupFormNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (isBot(data)) return;
    const entry = {
      startup: (data.get('startup') || '').toString().trim(),
      name: (data.get('name') || '').toString().trim(),
      stage: (data.get('stage') || '').toString().trim(),
      pitch: (data.get('pitch') || '').toString().trim(),
      contact: (data.get('contact') || '').toString().trim(),
      ts: Date.now(),
    };

    if (!entry.startup || !entry.name || !entry.stage || !entry.pitch || !entry.contact) {
      if (note) note.textContent = 'Please fill in all required fields.';
      return;
    }
    if (!isValidContact(entry.contact)) {
      if (note) note.textContent = 'Please enter a valid email or phone number.';
      return;
    }

    try {
      const raw = localStorage.getItem(STARTUP_APP_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem(STARTUP_APP_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* localStorage unavailable — submission still proceeds below */
    }

    form.reset();
    deliverAndReport('Startup Application', entry, note, "Application received. We'll follow up with you in the community.");

    window.open('https://chat.whatsapp.com/FMRIkeHuOK45pKjLTabjZZ', '_blank', 'noopener');
  });
}

/* ---------------------------------------------------------
   Talent Registration (Developer / Marketer / Designer / MBA)
   --------------------------------------------------------- */
const TALENT_STORAGE_KEY = 'cyphrweb_talent_registrations';

function initTalentForm() {
  const tabs = document.querySelectorAll('.talent-tabs .find-team__tab');
  const form = document.getElementById('talentForm');
  const note = document.getElementById('talentFormNote');
  let currentRole = 'Developer';

  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentRole = tab.getAttribute('data-role');
      });
    });
  }

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (isBot(data)) return;
    const entry = {
      role: currentRole,
      name: (data.get('name') || '').toString().trim(),
      skills: (data.get('skills') || '').toString().trim(),
      pitch: (data.get('pitch') || '').toString().trim(),
      contact: (data.get('contact') || '').toString().trim(),
      ts: Date.now(),
    };

    if (!entry.name || !entry.skills || !entry.contact) {
      if (note) note.textContent = 'Please fill in all required fields.';
      return;
    }
    if (!isValidContact(entry.contact)) {
      if (note) note.textContent = 'Please enter a valid email or phone number.';
      return;
    }

    try {
      const raw = localStorage.getItem(TALENT_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem(TALENT_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* localStorage unavailable — submission still proceeds below */
    }

    form.reset();
    deliverAndReport('Talent Registration', entry, note, `Registered as ${currentRole}. We'll be in touch in the community.`);

    window.open('https://chat.whatsapp.com/FMRIkeHuOK45pKjLTabjZZ', '_blank', 'noopener');
  });
}

/* ---------------------------------------------------------
   Newsletter signup
   --------------------------------------------------------- */
const NEWSLETTER_STORAGE_KEY = 'cyphrweb_newsletter_signups';

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('newsletterFormNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (isBot(data)) return;
    const entry = { email: (data.get('email') || '').toString().trim(), ts: Date.now() };

    if (!isValidEmail(entry.email)) {
      if (note) note.textContent = 'Please enter a valid email.';
      return;
    }

    try {
      const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* localStorage unavailable — submission still proceeds below */
    }

    form.reset();
    deliverAndReport('Newsletter Signup', entry, note, "You're subscribed — thanks!");
  });
}

/* ---------------------------------------------------------
   Products ecosystem
   --------------------------------------------------------- */
const productState = { filter: 'All', query: '', shown: PRODUCTS_PAGE_SIZE };
const PRODUCT_GRADIENTS = [
  ['#ea4c97', '#8b6cf0'], ['#8b6cf0', '#4c9aea'], ['#2fc4b2', '#4c9aea'],
  ['#f2a65a', '#ea4c97'], ['#5ad17a', '#2fc4b2'], ['#f26a5a', '#f2a65a']
];

function productGradient(p) {
  let h = 0;
  for (const c of String(p.id || p.name)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const g = PRODUCT_GRADIENTS[h % PRODUCT_GRADIENTS.length];
  return `--g1:${g[0]};--g2:${g[1]};`;
}

function productMark(p, size) {
  const logo = p.logo
    ? `<img src="${escapeHtml(encodeURI(String(p.logo)))}" alt="" loading="lazy" data-logo-fallback>`
    : '';
  return `<span class="pmark pmark--${size}" style="${productGradient(p)}" aria-hidden="true"><b>${escapeHtml(getInitials(p.name))}</b>${logo}</span>`;
}

function productStatusBadge(p) {
  const s = PRODUCT_STATUS[p.status] || PRODUCT_STATUS.early;
  return `<span class="pstatus pstatus--${escapeHtml(PRODUCT_STATUS[p.status] ? p.status : 'early')}">${s.icon} ${s.label}</span>`;
}

function productCta(p, label, cls) {
  return p.link
    ? `<a class="${cls}" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">${label}</a>`
    : `<button type="button" class="${cls}" data-product-id="${escapeHtml(p.id)}">${label}</button>`;
}

function productMatches(p) {
  const f = productState.filter;
  if (f !== 'All') {
    const tags = p.tags && p.tags.length ? p.tags : ['Other'];
    if (!tags.includes(f)) return false;
  }
  const q = productState.query.trim().toLowerCase();
  if (!q) return true;
  return [p.name, p.founder, p.category, p.description].join(' ').toLowerCase().includes(q);
}

function renderProductFeatured() {
  const box = document.getElementById('productFeatured');
  if (!box) return;
  const p = PRODUCTS.find((x) => x.id === FEATURED_PRODUCT_ID) || PRODUCTS[0];
  if (!p) { box.style.display = 'none'; return; }
  const feats = (p.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join('');
  const road = (p.roadmap || []).length
    ? `<div class="pfeatured__road"><span>Can expand into</span><div class="chips">${p.roadmap.map((r) => `<span>${escapeHtml(r)}</span>`).join('')}</div></div>`
    : '';
  box.innerHTML = `
    <article class="pfeatured__card" style="${productGradient(p)}">
      <div class="pfeatured__main">
        <div class="pfeatured__tags"><span class="pfeatured__flag">★ Featured Product</span>${productStatusBadge(p)}</div>
        <div class="pfeatured__title">${productMark(p, 'lg')}<div><h3>${escapeHtml(p.name)}</h3><span class="pcat">${escapeHtml(p.category)}</span></div></div>
        <p>${escapeHtml(p.description)}</p>
        <p class="pfeatured__by">Founder / team: <strong>${escapeHtml(p.founder)}</strong></p>
        ${productCta(p, 'Explore Product →', 'btn btn--primary')}
      </div>
      <div class="pfeatured__side">
        ${feats ? `<h4>Key features</h4><ul class="pfeatured__list">${feats}</ul>` : ''}
        ${road}
      </div>
    </article>`;
}

function renderProductFilters() {
  const wrap = document.getElementById('productFilters');
  if (!wrap) return;
  const count = (c) => PRODUCTS.filter((p) => (c === 'All') || (p.tags && p.tags.length ? p.tags : ['Other']).includes(c)).length;
  wrap.innerHTML = ['All'].concat(PRODUCT_CATEGORIES).map((c) => `
    <button type="button" role="tab" class="events-filters__tab pfilter${c === productState.filter ? ' is-active' : ''}" aria-selected="${c === productState.filter}" data-pfilter="${escapeHtml(c)}">${escapeHtml(c)}<i>${count(c)}</i></button>`).join('');
}

function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('productEmpty');
  const more = document.getElementById('productMore');
  if (!grid) return;
  const list = PRODUCTS.filter(productMatches);
  const visible = list.slice(0, productState.shown);

  grid.innerHTML = visible.map((p, i) => `
    <article class="pcard" style="${productGradient(p)}--i:${i % PRODUCTS_PAGE_SIZE};">
      <div class="pcard__top">${productMark(p, 'md')}${productStatusBadge(p)}</div>
      <h3>${escapeHtml(p.name)}</h3>
      <span class="pcat">${escapeHtml(p.category)}</span>
      <p>${escapeHtml(p.description)}</p>
      <div class="pcard__foot">
        <span class="pcard__by"><small>Founder / team</small>${escapeHtml(p.founder)}</span>
        ${productCta(p, p.link ? 'View Product <span aria-hidden="true">→</span>' : 'Explore <span aria-hidden="true">→</span>', 'pcard__cta')}
      </div>
    </article>`).join('');

  if (empty) empty.hidden = list.length > 0;
  if (more) more.hidden = list.length <= productState.shown;
}

function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const feats = (p.features || []).length ? `<ul>${p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : '';
  const road = (p.roadmap || []).length
    ? `<p class="fineprint">Can expand into</p><div class="chips">${p.roadmap.map((r) => `<span>${escapeHtml(r)}</span>`).join('')}</div>`
    : '';
  openModal(`
    <span class="modal__badge">${escapeHtml(PRODUCT_STATUS[p.status] ? PRODUCT_STATUS[p.status].label : 'Early Stage')}</span>
    <h3>${escapeHtml(p.name)}</h3>
    <ul><li>Founder / team: ${escapeHtml(p.founder)}</li><li>Category: ${escapeHtml(p.category)}</li></ul>
    <p>${escapeHtml(p.description)}</p>
    ${feats}${road}
    <p class="fineprint">A public product page will be linked here once it is ready.</p>`);
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  renderProductFeatured();
  renderProductFilters();
  renderProductGrid();

  // Everything below is delegated, so re-rendering never needs re-binding
  const section = document.getElementById('products');
  section.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-pfilter]');
    if (tab) {
      productState.filter = tab.getAttribute('data-pfilter');
      productState.shown = PRODUCTS_PAGE_SIZE;
      renderProductFilters();
      renderProductGrid();
      return;
    }
    const btn = e.target.closest('button[data-product-id]');
    if (btn) { openProductModal(btn.getAttribute('data-product-id')); return; }
    if (e.target.closest('#productMore')) {
      productState.shown += PRODUCTS_PAGE_SIZE;
      renderProductGrid();
    }
  });

  const search = document.getElementById('productSearch');
  if (search) search.addEventListener('input', () => {
    productState.query = search.value;
    productState.shown = PRODUCTS_PAGE_SIZE;
    renderProductGrid();
  });

  // Cursor-following glow on cards
  grid.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.pcard');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // Broken logo path -> keep the generated initials logo
  section.addEventListener('error', (e) => {
    if (e.target && e.target.matches && e.target.matches('img[data-logo-fallback]')) e.target.remove();
  }, true);
}

/* ---------------------------------------------------------
   Utility
   --------------------------------------------------------- */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
