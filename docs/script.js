/* ═══════════════════════════════════════════════════════
   CARL // ARCHITECTURAL DEVELOPER PORTFOLIO — script.js
   ══════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────────────
   0. SECURITY HELPERS (Frame Guard, URL Sanitizer, Storage)
   ───────────────────────────────────────────────────── */
(function enforceFrameGuard() {
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch {
      document.documentElement.style.display = 'none';
    }
  }
})();

/** Allow only safe relative `images/...` paths or `https://` URLs. */
function sanitizeUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || /[\x00-\x1F\x7F]/.test(trimmed)) return '';
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  if (/^images\/[a-zA-Z0-9_.\-/]+$/.test(trimmed) && !trimmed.includes('..')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:') return parsed.href;
  } catch {
    return '';
  }
  return '';
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted/sandboxed contexts
  }
}

function decodeCodes(codes) {
  return String.fromCharCode(...codes);
}

const CONTACT_CHANNELS = {
  facebook: {
    label: 'Facebook',
    getDisplay: () => 'Justine Carl',
    getCopy: () => 'Justine Carl'
  },
  phone: {
    label: 'Phone',
    getDisplay: () => decodeCodes([40, 43, 54, 51, 41, 32, 57, 54, 56, 32, 52, 50, 48, 32, 50, 50, 57, 48]),
    getCopy: () => decodeCodes([48, 57, 54, 56, 52, 50, 48, 50, 50, 57, 48])
  },
  email: {
    label: 'Email',
    getDisplay: () => decodeCodes([106, 117, 115, 116, 105, 110, 46, 102, 97, 98, 105, 97, 110, 49, 49, 52, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109]),
    getCopy: () => decodeCodes([106, 117, 115, 116, 105, 110, 46, 102, 97, 98, 105, 97, 110, 49, 49, 52, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109])
  }
};

/* ─────────────────────────────────────────────────────
   1. DATA CATALOGS (Projects & Categorized Tech Stack)
   ───────────────────────────────────────────────────── */
const PROJECTS = [
  // AI & AUTOMATION
  {
    id: 'ai-1',
    cat: 'ai',
    catLabel: 'AI & AUTOMATION',
    title: 'Automated Evidence Classifier',
    desc: 'A microservice that analyzes logs and flags anomalies using transformer models and explainable outputs.',
    arch: 'FastAPI inference worker paired with quantized transformer embeddings, structured SHAP attribution, and deterministic audit logging.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'Explainable AI'],
    img: 'images/project-ai1.svg'
  },
  {
    id: 'ai-2',
    cat: 'ai',
    catLabel: 'AI & AUTOMATION',
    title: 'SchedulerBot',
    desc: 'Automation pipeline for task scheduling and environment hardening across servers.',
    arch: 'Idempotent Ansible playbooks orchestrated by an event-driven cron daemon with drift detection and automated rollback.',
    tags: ['Ansible', 'Linux', 'Python', 'Hardening'],
    img: 'images/project-ai2.svg'
  },
  {
    id: 'ai-3',
    cat: 'ai',
    catLabel: 'AI & AUTOMATION',
    title: 'Predictive Ops',
    desc: 'ML pipelines for capacity planning and fault prediction using time-series forecasting.',
    arch: 'Prometheus telemetry ingestion feeding rolling time-series models to surface saturation anomalies before SLA breach.',
    tags: ['TensorFlow', 'Prometheus', 'Time-Series', 'Grafana'],
    img: 'images/project-ai3.svg'
  },

  // DATA ANALYSIS
  {
    id: 'data-1',
    cat: 'data',
    catLabel: 'DATA ANALYSIS',
    title: 'PulseBI Executive Dashboard',
    desc: 'Real-time executive BI dashboard streaming simulated and public dataset metrics via WebSockets/SSE.',
    arch: 'Built with React or vanilla JS + Apache ECharts or Chart.js, streaming simulated or public dataset metrics via WebSockets/SSE and hosted free on Vercel or GitHub Pages.',
    tags: ['React', 'Apache ECharts', 'Chart.js', 'WebSockets / SSE'],
    img: 'images/project-web1.svg'
  },
  {
    id: 'data-2',
    cat: 'data',
    catLabel: 'DATA ANALYSIS',
    title: 'CohortLens Retention Explorer',
    desc: 'Zero-backend SQL analytics explorer running DuckDB-Wasm directly in the browser on uploaded CSV/Parquet files.',
    arch: 'Uses DuckDB-Wasm to run real SQL analytical queries directly inside the user\'s browser on uploaded CSV/Parquet files with zero backend server costs, paired with Plotly.js for cohort heatmaps.',
    tags: ['DuckDB-Wasm', 'SQL', 'CSV / Parquet', 'Plotly.js'],
    img: 'images/project-web2.svg'
  },
  {
    id: 'data-3',
    cat: 'data',
    catLabel: 'DATA ANALYSIS',
    title: 'FunnelFlow Attribution Tracker',
    desc: 'Funnel attribution and A/B testing tracker backed by Supabase PostgreSQL with statistical confidence intervals.',
    arch: 'Pairs a Supabase (free-tier PostgreSQL) backend with a lightweight frontend visualization layer using Recharts or D3.js and built-in JavaScript statistical functions (jStat) for A/B confidence intervals.',
    tags: ['Supabase', 'PostgreSQL', 'Recharts / D3.js', 'jStat'],
    img: 'images/project-web3.svg'
  },

  // NETWORK & INFRA
  {
    id: 'net-1',
    cat: 'net',
    catLabel: 'NETWORK & INFRA',
    title: 'Resilient WAN',
    desc: 'SD-WAN deployment with automated failover and per-site QoS policies.',
    arch: 'Dual-ISP active/standby BGP & IPSec tunnels with sub-second health probes and traffic-class prioritization.',
    tags: ['Cisco', 'SD-WAN', 'QoS', 'BGP'],
    img: 'images/project-net1.svg'
  },
  {
    id: 'net-2',
    cat: 'net',
    catLabel: 'NETWORK & INFRA',
    title: 'VoIP Telephony Suite',
    desc: 'CME + TFTP provisioning for secure, scalable phone deployment.',
    arch: 'Automated DHCP option-150 + TFTP configuration templates with segmented voice VLANs and SRTP encryption.',
    tags: ['Cisco CME', 'TFTP', 'VoIP', 'VLAN'],
    img: 'images/voip-proj.png',
    demo: 'images/TerminalAssessment2_Demo.mp4',
    doc: 'images/GRP11-Terminal-Assessment-2.pdf'
  },
  {
    id: 'net-3',
    cat: 'net',
    catLabel: 'NETWORK & INFRA',
    title: 'Secure Edge',
    desc: 'Firewall automation and zero-trust enforcement at border routers.',
    arch: 'Declarative ACL & WireGuard/NGINX edge rules deployed via Terraform with automated compliance verification.',
    tags: ['Terraform', 'NGINX', 'Zero-Trust', 'Linux'],
    img: 'images/project-net3.svg'
  },

  // APPLICATIONS
  {
    id: 'app-1',
    cat: 'apps',
    catLabel: 'APPLICATIONS',
    title: 'Pollos Delivery App',
    desc: 'Cross-platform delivery app with offline-first ordering and encrypted storage.',
    arch: 'Local-first encrypted SQLite queue with conflict-free background sync and live courier telemetry.',
    tags: ['Offline-First', 'Firebase', 'Encryption', 'Mobile'],
    img: 'images/project-app1.svg'
  },
  {
    id: 'app-2',
    cat: 'apps',
    catLabel: 'APPLICATIONS',
    title: 'Staff Companion',
    desc: 'Shift management and task tracking native app for employees.',
    arch: 'Role-scoped mobile client with push-driven shift handoffs, biometric lock, and real-time checklist sync.',
    tags: ['React', 'Node.js', 'Push', 'Auth'],
    img: 'images/project-app2.svg'
  },
  {
    id: 'app-3',
    cat: 'apps',
    catLabel: 'APPLICATIONS',
    title: 'Inventory Scanner',
    desc: 'Mobile scanning app integrated with real-time stock reconciliation.',
    arch: 'Low-latency barcode/QR pipeline validating SKU batches directly against transactional warehouse ledgers.',
    tags: ['PostgreSQL', 'REST', 'Scanner', 'Real-Time'],
    img: 'images/project-app3.svg'
  }
];

const TECH_STACK = [
  // [01] LANGUAGES & RUNTIME
  { id: 'nodejs',   name: 'Node.js',  cat: 'lang', catCode: '01' },
  { id: 'python',   name: 'Python',   cat: 'lang', catCode: '01' },
  { id: 'go',       name: 'Go',       cat: 'lang', catCode: '01' },
  { id: 'rust',     name: 'Rust',     cat: 'lang', catCode: '01' },
  { id: 'java',     name: 'Java',     cat: 'lang', catCode: '01' },
  { id: 'cpp',      name: 'C++',      cat: 'lang', catCode: '01' },
  { id: 'react',    name: 'React',    cat: 'lang', catCode: '01' },
  { id: 'vue',      name: 'Vue',      cat: 'lang', catCode: '01' },
  { id: 'angular',  name: 'Angular',  cat: 'lang', catCode: '01' },
  { id: 'graphql',  name: 'GraphQL',  cat: 'lang', catCode: '01' },

  // [02] CLOUD & DEVOPS
  { id: 'docker',         name: 'Docker',         cat: 'cloud', catCode: '02' },
  { id: 'docker-compose', name: 'Docker Compose', cat: 'cloud', catCode: '02' },
  { id: 'kubernetes',     name: 'Kubernetes',     cat: 'cloud', catCode: '02' },
  { id: 'aws',            name: 'AWS',            cat: 'cloud', catCode: '02' },
  { id: 'gcp',            name: 'GCP',            cat: 'cloud', catCode: '02' },
  { id: 'azure',          name: 'Azure',          cat: 'cloud', catCode: '02' },
  { id: 'terraform',      name: 'Terraform',      cat: 'cloud', catCode: '02' },
  { id: 'ansible',        name: 'Ansible',        cat: 'cloud', catCode: '02' },
  { id: 'jenkins',        name: 'Jenkins',        cat: 'cloud', catCode: '02' },
  { id: 'git',            name: 'Git',            cat: 'cloud', catCode: '02' },
  { id: 'linux',          name: 'Linux',          cat: 'cloud', catCode: '02' },
  { id: 'firebase',       name: 'Firebase',       cat: 'cloud', catCode: '02' },

  // [03] DATA & AI
  { id: 'postgres',   name: 'PostgreSQL', cat: 'data', catCode: '03' },
  { id: 'mongodb',    name: 'MongoDB',    cat: 'data', catCode: '03' },
  { id: 'redis',      name: 'Redis',      cat: 'data', catCode: '03' },
  { id: 'tensorflow', name: 'TensorFlow', cat: 'data', catCode: '03' },
  { id: 'pytorch',    name: 'PyTorch',    cat: 'data', catCode: '03' },
  { id: 'openai',     name: 'OpenAI',     cat: 'data', catCode: '03' },

  // [04] NETWORKING & INFRA
  { id: 'cisco',      name: 'Cisco',      cat: 'net', catCode: '04' },
  { id: 'nginx',      name: 'NGINX',      cat: 'net', catCode: '04' },
  { id: 'prometheus', name: 'Prometheus', cat: 'net', catCode: '04' },
  { id: 'grafana',    name: 'Grafana',    cat: 'net', catCode: '04' }
];

/* ─────────────────────────────────────────────────────
   2. TOAST HELPER
   ───────────────────────────────────────────────────── */
const toastContainer = document.getElementById('toast-container');

function showToast(message) {
  if (!toastContainer) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.2s';
    setTimeout(() => el.remove(), 220);
  }, 2400);
}

/* ─────────────────────────────────────────────────────
   3. BOOT / PRELOADER SEQUENCE
   ───────────────────────────────────────────────────── */
(function initBootLoader() {
  const loader = document.getElementById('boot-loader');
  const pctEl = document.getElementById('boot-pct');
  const barEl = document.getElementById('boot-bar-fill');
  const statusEl = document.getElementById('boot-status');
  const logsEl = document.getElementById('boot-logs');
  if (!loader) return;

  const DURATION_MS = 4400;
  const HOLD_GRANTED_MS = 650;

  const stages = [
    [0,   'INITIALIZING_SECURE_SHELL...', '[INIT]', 'kernel::carl_os v2.4.0 booting'],
    [14,  'VERIFYING_SESSION_KEYS...',    '[OK]',   'ed25519 session handshake verified'],
    [30,  'LOADING_SYSTEM_MODULES...',    '[LOAD]', 'accent_engine & dot_grid mounted'],
    [48,  'INDEXING_PORTFOLIO_DATA...',   '[LOAD]', '12 project specs indexed'],
    [66,  'INDEXING_TECH_BENTO...',       '[LOAD]', '32 stack modules verified'],
    [82,  'MOUNTING_CLI_INTERFACE...',    '[OK]',   'guest@carl:~$ interactive shell ready'],
    [93,  'AUTHENTICATING_CLEARANCE...',  '[AUTH]', 'clearance_level=GUEST_ROOT'],
    [100, '[OK] ACCESS GRANTED',           '[OK]',   'ACCESS GRANTED — launching workspace']
  ];

  let dismissed = false;
  let rafId = null;
  let loggedCount = 0;

  function appendBootLog(tag, text, isGranted = false) {
    if (!logsEl) return;
    const row = document.createElement('div');
    row.className = `boot-log-entry${isGranted ? ' is-granted' : ''}`;
    const tagSpan = document.createElement('span');
    tagSpan.className = 'log-tag';
    tagSpan.textContent = tag;
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    row.append(tagSpan, textSpan);
    logsEl.appendChild(row);
    logsEl.scrollTop = logsEl.scrollHeight;
  }

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    if (rafId) cancelAnimationFrame(rafId);
    loader.classList.add('done');
    document.removeEventListener('keydown', onSkipKey);
  }

  function onSkipKey() {
    dismiss();
  }

  loader.addEventListener('click', dismiss);
  document.addEventListener('keydown', onSkipKey);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pctEl.textContent = '100%';
    barEl.style.width = '100%';
    statusEl.textContent = '[OK] ACCESS GRANTED';
    statusEl.classList.add('boot-granted');
    appendBootLog('[OK]', 'ACCESS GRANTED — launching workspace', true);
    setTimeout(dismiss, 220);
    return;
  }

  const startTime = performance.now();

  function tick(now) {
    if (dismissed) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION_MS);
    const pct = Math.floor(progress * 100);

    pctEl.textContent = `${pct}%`;
    barEl.style.width = `${pct}%`;

    while (loggedCount < stages.length && pct >= stages[loggedCount][0]) {
      const [, label, tag, logText] = stages[loggedCount];
      statusEl.textContent = label;
      appendBootLog(tag, logText, stages[loggedCount][0] === 100);
      loggedCount++;
    }

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      statusEl.classList.add('boot-granted');
      setTimeout(dismiss, HOLD_GRANTED_MS);
    }
  }

  rafId = requestAnimationFrame(tick);
})();

/* ─────────────────────────────────────────────────────
   4. DYNAMIC ACCENT COLOR ENGINE
   ───────────────────────────────────────────────────── */
const DEFAULT_ACCENT = '#10b981';
const ACCENT_STORAGE_KEY = 'carl_accent_hex';

const accentTrigger = document.getElementById('accent-trigger');
const accentPopover = document.getElementById('accent-popover');
const accentHexLabel = document.querySelector('.accent-hex-label');
const hexInput = document.getElementById('hex-input');
const hueSlider = document.getElementById('hue-slider');
const svCanvas = document.getElementById('sv-canvas');
const svCursor = document.getElementById('sv-cursor');
const accentResetBtn = document.getElementById('accent-reset');

let currentHsv = { h: 160, s: 0.91, v: 0.73 };

function normalizeHex(val) {
  if (!val) return null;
  let h = val.trim();
  if (!h.startsWith('#')) h = '#' + h;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toLowerCase() : null;
}

function hsvToHex(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)      { r = c; g = x; b = 0; }
  else if (h < 120){ r = x; g = c; b = 0; }
  else if (h < 180){ r = 0; g = c; b = x; }
  else if (h < 240){ r = 0; g = x; b = c; }
  else if (h < 300){ r = x; g = 0; b = c; }
  else             { r = c; g = 0; b = x; }

  const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function renderSvCanvas(hue) {
  if (!svCanvas) return;
  const ctx = svCanvas.getContext('2d');
  const w = svCanvas.width;
  const h = svCanvas.height;

  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.fillRect(0, 0, w, h);

  const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
  whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
  whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = whiteGrad;
  ctx.fillRect(0, 0, w, h);

  const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
  blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
  blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = blackGrad;
  ctx.fillRect(0, 0, w, h);
}

function applyAccentColor(hex, syncPicker = true) {
  const valid = normalizeHex(hex);
  if (!valid) return false;

  document.documentElement.style.setProperty('--accent', valid);
  safeStorageSet(ACCENT_STORAGE_KEY, valid);

  if (accentHexLabel) accentHexLabel.textContent = valid.toUpperCase();
  if (hexInput && document.activeElement !== hexInput) {
    hexInput.value = valid.toUpperCase();
  }

  if (syncPicker) {
    currentHsv = hexToHsv(valid);
    if (hueSlider) hueSlider.value = currentHsv.h;
    renderSvCanvas(currentHsv.h);
    if (svCursor) {
      svCursor.style.left = `${currentHsv.s * 100}%`;
      svCursor.style.top = `${(1 - currentHsv.v) * 100}%`;
    }
  }
  return true;
}

// Init saved or default accent
applyAccentColor(safeStorageGet(ACCENT_STORAGE_KEY) || DEFAULT_ACCENT, true);

function toggleAccentPopover(force) {
  const open = typeof force === 'boolean' ? force : !accentPopover.classList.contains('open');
  accentPopover.classList.toggle('open', open);
  accentPopover.setAttribute('aria-hidden', String(!open));
  accentTrigger.setAttribute('aria-expanded', String(open));
}

accentTrigger?.addEventListener('click', e => {
  e.stopPropagation();
  toggleAccentPopover();
});

document.addEventListener('click', e => {
  if (accentPopover?.classList.contains('open') && !e.target.closest('.accent-control-wrap')) {
    toggleAccentPopover(false);
  }
});

accentResetBtn?.addEventListener('click', () => {
  applyAccentColor(DEFAULT_ACCENT, true);
  showToast(`ACCENT_RESET -> ${DEFAULT_ACCENT.toUpperCase()}`);
});

document.querySelectorAll('.swatch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyAccentColor(btn.dataset.hex, true);
  });
});

hexInput?.addEventListener('input', e => {
  const valid = normalizeHex(e.target.value);
  if (valid) applyAccentColor(valid, true);
});

hueSlider?.addEventListener('input', e => {
  currentHsv.h = Number(e.target.value);
  renderSvCanvas(currentHsv.h);
  applyAccentColor(hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v), false);
});

if (svCanvas) {
  let dragging = false;
  const pickSv = e => {
    const rect = svCanvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    currentHsv.s = x;
    currentHsv.v = 1 - y;
    svCursor.style.left = `${x * 100}%`;
    svCursor.style.top = `${y * 100}%`;
    applyAccentColor(hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v), false);
  };

  svCanvas.addEventListener('mousedown', e => { dragging = true; pickSv(e); });
  window.addEventListener('mousemove', e => { if (dragging) pickSv(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
}

/* ─────────────────────────────────────────────────────
   5. HEADER SCROLL-SPY, PROGRESS & MOBILE NAV
   ───────────────────────────────────────────────────── */
const scrollProgress = document.getElementById('scroll-progress');
const navLinks = document.querySelectorAll('.nav-link');
const spySections = ['hero', 'about', 'projects', 'tech', 'contact'];

function updateScrollUI() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
  if (scrollProgress) scrollProgress.style.width = `${pct}%`;

  let activeId = 'hero';
  for (const id of spySections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      activeId = id;
    }
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === activeId);
  });
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

mobileNavToggle?.addEventListener('click', () => {
  const open = !mobileNavDrawer.classList.contains('open');
  mobileNavDrawer.classList.toggle('open', open);
  mobileNavDrawer.setAttribute('aria-hidden', String(!open));
  mobileNavToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* ─────────────────────────────────────────────────────
   6. PROJECTS FILTER + SPEC DRAWER
   ───────────────────────────────────────────────────── */
const projectsGrid = document.getElementById('projects-grid');
const projectCountLabel = document.getElementById('project-count-label');
const projectTabs = document.querySelectorAll('.filter-tab');
const projectTabIndicator = document.getElementById('project-tab-indicator');

const drawer = document.getElementById('project-drawer');
const drawerClose = document.getElementById('drawer-close');
const drawerIdx = document.getElementById('drawer-index');
const drawerCat = document.getElementById('drawer-category');
const drawerImg = document.getElementById('drawer-img');
const drawerVideo = document.getElementById('drawer-video');
const drawerTitle = document.getElementById('drawer-title');
const drawerDesc = document.getElementById('drawer-desc');
const drawerArch = document.getElementById('drawer-arch');
const drawerTags = document.getElementById('drawer-tags');
const drawerDemoBtn = document.getElementById('drawer-demo-btn');
const drawerDocBtn = document.getElementById('drawer-doc-btn');

let activeDemoSrc = null;

function moveTabIndicator(tab) {
  if (!projectTabIndicator || !tab) return;
  projectTabIndicator.style.left = `${tab.offsetLeft}px`;
  projectTabIndicator.style.width = `${tab.offsetWidth}px`;
}

function resetDrawerMedia() {
  if (drawerVideo) {
    drawerVideo.pause();
    drawerVideo.removeAttribute('src');
    drawerVideo.load();
    drawerVideo.hidden = true;
  }
  if (drawerImg) drawerImg.hidden = false;
  if (drawerDemoBtn) {
    const label = drawerDemoBtn.querySelector('span');
    if (label) label.textContent = '▶ Demo';
  }
}

function openProjectDrawer(project, indexLabel) {
  resetDrawerMedia();
  activeDemoSrc = project.demo ? sanitizeUrl(project.demo) : null;

  drawerIdx.textContent = indexLabel;
  drawerCat.textContent = project.catLabel;
  const safeImg = sanitizeUrl(project.img);
  if (safeImg) drawerImg.src = safeImg;
  else drawerImg.removeAttribute('src');
  drawerImg.alt = `${project.title} architecture diagram`;
  drawerTitle.textContent = project.title;
  drawerDesc.textContent = project.desc;
  drawerArch.textContent = project.arch;

  drawerTags.replaceChildren(
    ...project.tags.map(t => {
      const span = document.createElement('span');
      span.className = 'drawer-tag';
      span.textContent = t;
      return span;
    })
  );

  if (drawerDemoBtn) {
    drawerDemoBtn.disabled = !activeDemoSrc;
    drawerDemoBtn.classList.toggle('is-disabled', !activeDemoSrc);
  }

  const safeDoc = project.doc ? sanitizeUrl(project.doc) : '';
  if (drawerDocBtn) {
    drawerDocBtn.rel = 'noopener noreferrer';
    if (safeDoc) {
      drawerDocBtn.href = safeDoc;
      drawerDocBtn.classList.remove('is-disabled');
      drawerDocBtn.removeAttribute('aria-disabled');
    } else {
      drawerDocBtn.href = '#';
      drawerDocBtn.classList.add('is-disabled');
      drawerDocBtn.setAttribute('aria-disabled', 'true');
    }
  }

  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  setTimeout(() => drawerClose?.focus(), 40);
}

drawerDemoBtn?.addEventListener('click', () => {
  const safeDemo = activeDemoSrc ? sanitizeUrl(activeDemoSrc) : '';
  if (!safeDemo || !drawerVideo || !drawerImg) return;
  const showingVideo = !drawerVideo.hidden;
  const label = drawerDemoBtn.querySelector('span');

  if (showingVideo) {
    resetDrawerMedia();
  } else {
    drawerImg.hidden = true;
    drawerVideo.src = safeDemo;
    drawerVideo.hidden = false;
    drawerVideo.play().catch(() => {});
    if (label) label.textContent = '■ Preview';
  }
});

function closeProjectDrawer() {
  resetDrawerMedia();
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

drawerClose?.addEventListener('click', closeProjectDrawer);
drawer?.addEventListener('click', e => {
  if (e.target === drawer) closeProjectDrawer();
});

function renderProjects(category = 'all') {
  const list = category === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === category);
  if (projectCountLabel) {
    projectCountLabel.textContent = `SHOWING ${String(list.length).padStart(2, '0')} / ${PROJECTS.length}`;
  }

  projectsGrid.replaceChildren();
  list.forEach((project, idx) => {
    const indexLabel = String(idx + 1).padStart(2, '0');
    const card = document.createElement('article');
    card.className = 'project-card';

    const top = document.createElement('div');
    top.className = 'project-card-top mono';
    const idxSpan = document.createElement('span');
    idxSpan.className = 'project-idx';
    idxSpan.textContent = indexLabel;
    const catSpan = document.createElement('span');
    catSpan.className = 'project-cat-badge';
    catSpan.textContent = project.catLabel;
    top.append(idxSpan, catSpan);

    const h3 = document.createElement('h3');
    h3.textContent = project.title;

    const p = document.createElement('p');
    p.textContent = project.desc;

    const actions = document.createElement('div');
    actions.className = 'project-actions';
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'project-btn project-btn-primary mono';
    viewBtn.dataset.action = 'view';
    viewBtn.textContent = 'View';
    viewBtn.addEventListener('click', () => openProjectDrawer(project, indexLabel));
    actions.appendChild(viewBtn);

    card.append(top, h3, p, actions);
    projectsGrid.appendChild(card);
  });
}

projectTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    projectTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    moveTabIndicator(tab);
    renderProjects(tab.dataset.cat);
  });
});

renderProjects('all');
requestAnimationFrame(() => moveTabIndicator(document.querySelector('.filter-tab.active')));
window.addEventListener('resize', () => moveTabIndicator(document.querySelector('.filter-tab.active')));

/* ─────────────────────────────────────────────────────
   7. TECH STACK BENTO MATRIX
   ───────────────────────────────────────────────────── */
const techBento = document.getElementById('tech-bento');
const techTabs = document.querySelectorAll('.stack-tab');
const techCountLabel = document.getElementById('tech-count-label');

function renderTechStack(cat = 'all') {
  const list = cat === 'all' ? TECH_STACK : TECH_STACK.filter(t => t.cat === cat);
  if (techCountLabel) {
    techCountLabel.textContent = `${list.length} MODULES LOADED`;
  }

  techBento.replaceChildren();
  list.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'tech-cell';
    cell.title = `${item.name} — Module [${item.catCode}]`;

    const catEl = document.createElement('span');
    catEl.className = 'tech-cell-cat mono';
    catEl.textContent = `[${item.catCode}]`;

    const imgEl = document.createElement('img');
    const safeLogo = sanitizeUrl(`images/logos/${item.id}.svg`);
    if (safeLogo) imgEl.src = safeLogo;
    imgEl.alt = item.name;
    imgEl.loading = 'lazy';

    const nameEl = document.createElement('span');
    nameEl.className = 'tech-cell-name mono';
    nameEl.textContent = item.name;

    cell.append(catEl, imgEl, nameEl);
    techBento.appendChild(cell);
  });
}

techTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    techTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderTechStack(tab.dataset.stack);
  });
});

renderTechStack('all');

/* ─────────────────────────────────────────────────────
   8. INTERACTIVE CLI TERMINAL ENGINE (HERO + MODAL)
   ───────────────────────────────────────────────────── */
const terminalModal = document.getElementById('terminal-modal');
const terminalToggleBtn = document.getElementById('terminal-toggle');
const heroOpenTermBtn = document.getElementById('hero-open-terminal');
const terminalModalClose = document.getElementById('terminal-modal-close');
const modalTermInput = document.getElementById('modal-term-input');

const commandHistory = [];
let historyIndex = -1;

function openTerminalModal() {
  terminalModal.classList.add('open');
  terminalModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => modalTermInput?.focus(), 40);
}

function closeTerminalModal() {
  terminalModal.classList.remove('open');
  terminalModal.setAttribute('aria-hidden', 'true');
}

terminalToggleBtn?.addEventListener('click', openTerminalModal);
heroOpenTermBtn?.addEventListener('click', openTerminalModal);
terminalModalClose?.addEventListener('click', closeTerminalModal);
terminalModal?.addEventListener('click', e => {
  if (e.target === terminalModal) closeTerminalModal();
});

const MAX_CMD_LEN = 120;

function appendTerminalLine(outputEl, content, className = '') {
  const div = document.createElement('div');
  div.className = `term-line ${className}`.trim();

  if (typeof content === 'string') {
    div.textContent = content;
  } else if (Array.isArray(content)) {
    content.forEach((lineSegments, lineIdx) => {
      if (lineIdx > 0) div.appendChild(document.createElement('br'));
      if (typeof lineSegments === 'string') {
        div.appendChild(document.createTextNode(lineSegments));
      } else if (Array.isArray(lineSegments)) {
        lineSegments.forEach(seg => {
          if (typeof seg === 'string') {
            div.appendChild(document.createTextNode(seg));
          } else if (seg && typeof seg === 'object') {
            const span = document.createElement('span');
            if (seg.cls) span.className = seg.cls;
            span.textContent = seg.text;
            div.appendChild(span);
          }
        });
      }
    });
  }

  outputEl.appendChild(div);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function executeCommand(raw, outputEl) {
  const sanitized = String(raw || '').replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, MAX_CMD_LEN);
  if (!sanitized) return;

  commandHistory.unshift(sanitized);
  historyIndex = -1;

  appendTerminalLine(outputEl, [[{ cls: 'term-prompt', text: 'guest@carl:~$' }, sanitized]]);

  const [cmdRaw, ...args] = sanitized.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();

  switch (cmd) {
    case 'help':
      appendTerminalLine(outputEl, [
        'Available commands:',
        ['  ', { cls: 'accent-text', text: 'whoami' }, '       — engineer identity & philosophy'],
        ['  ', { cls: 'accent-text', text: 'about' }, '        — jump to [01] about_me'],
        ['  ', { cls: 'accent-text', text: 'projects' }, '     — list 12 builds (or filter: ai|data|net|apps)'],
        ['  ', { cls: 'accent-text', text: 'stack' }, '        — summarize 32 tech modules'],
        ['  ', { cls: 'accent-text', text: 'contact' }, '      — print direct channels'],
        ['  ', { cls: 'accent-text', text: 'theme <hex>' }, '  — set live accent (e.g. theme #38bdf8 | reset)'],
        ['  ', { cls: 'accent-text', text: 'clear' }, '        — clear terminal output']
      ], 'term-output-block');
      break;

    case 'whoami':
      appendTerminalLine(outputEl,
        'Carl — IT Student focused on data analysis, interactive BI dashboards, automations, and resilient infrastructure.',
        'term-output-block'
      );
      break;

    case 'about':
      appendTerminalLine(outputEl,
        'Navigating to [01] about_me — Discipline · Precision · Trust.',
        'term-output-block'
      );
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      break;

    case 'projects': {
      const catArg = args[0]?.toLowerCase();
      const filtered = catArg && ['ai', 'data', 'net', 'apps'].includes(catArg)
        ? PROJECTS.filter(p => p.cat === catArg)
        : PROJECTS;
      const lines = filtered.map((p, i) => [
        `${String(i + 1).padStart(2, '0')}. ${p.title} `,
        { cls: 'term-muted', text: `[${p.catLabel}]` }
      ]);
      appendTerminalLine(outputEl, lines, 'term-output-block');
      break;
    }

    case 'stack':
      appendTerminalLine(outputEl, [
        '[01] LANGUAGES & RUNTIME: Node.js, Python, Go, Rust, Java, C++, React, Vue, Angular, GraphQL',
        '[02] CLOUD & DEVOPS: Docker, Compose, Kubernetes, AWS, GCP, Azure, Terraform, Ansible, Jenkins, Git, Linux, Firebase',
        '[03] DATA & AI: PostgreSQL, MongoDB, Redis, TensorFlow, PyTorch, OpenAI',
        '[04] NETWORKING & INFRA: Cisco, NGINX, Prometheus, Grafana'
      ], 'term-output-block');
      break;

    case 'contact':
      appendTerminalLine(outputEl, [
        `FACEBOOK : ${CONTACT_CHANNELS.facebook.getDisplay()}`,
        `PHONE    : ${CONTACT_CHANNELS.phone.getDisplay()}`,
        `EMAIL    : ${CONTACT_CHANNELS.email.getDisplay()}`
      ], 'term-output-block');
      break;

    case 'theme': {
      const target = args[0];
      if (!target) {
        appendTerminalLine(outputEl, 'Usage: theme <hex> or theme reset (e.g. theme #38bdf8)', 'term-error');
        break;
      }
      if (target.toLowerCase() === 'reset') {
        applyAccentColor(DEFAULT_ACCENT, true);
        appendTerminalLine(outputEl, `[OK] Accent reset to ${DEFAULT_ACCENT}`, 'term-output-block');
      } else if (applyAccentColor(target, true)) {
        appendTerminalLine(outputEl, `[OK] Accent updated to ${normalizeHex(target)}`, 'term-output-block');
      } else {
        appendTerminalLine(outputEl, `Invalid hex color: ${target}`, 'term-error');
      }
      break;
    }

    case 'clear':
      outputEl.replaceChildren();
      break;

    default:
      appendTerminalLine(outputEl, `command not found: ${cmd}. Type 'help'.`, 'term-error');
  }
}

document.querySelectorAll('[data-terminal-form]').forEach(form => {
  const mode = form.dataset.terminalForm;
  const input = form.querySelector('.term-input');
  const output = document.getElementById(mode === 'hero' ? 'hero-term-output' : 'modal-term-output');

  form.addEventListener('submit', e => {
    e.preventDefault();
    executeCommand(input.value, output);
    input.value = '';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        input.value = '';
      }
    }
  });
});

/* ─────────────────────────────────────────────────────
   9. CONTACT COPY-TO-CLIPBOARD + FORM DISPATCH
   ───────────────────────────────────────────────────── */
document.querySelectorAll('[data-protected-channel]').forEach(el => {
  const ch = CONTACT_CHANNELS[el.dataset.protectedChannel];
  if (ch) el.textContent = ch.getDisplay();
});

document.querySelectorAll('.channel-row').forEach(row => {
  row.addEventListener('click', async () => {
    const channelKey = row.dataset.channel;
    const ch = CONTACT_CHANNELS[channelKey];
    if (!ch) return;
    const value = ch.getCopy();
    const label = ch.label;
    try {
      await navigator.clipboard.writeText(value);
      const badge = row.querySelector('.copy-badge');
      if (badge) {
        badge.textContent = 'COPIED';
        setTimeout(() => { badge.textContent = 'COPY'; }, 1600);
      }
      showToast(`[COPIED] ${label}: ${value}`);
    } catch {
      showToast(`${label}: ${value}`);
    }
  });
});

const contactForm = document.getElementById('contact-form');
const dispatchModal = document.getElementById('dispatch-modal');
const dispatchClose = document.getElementById('dispatch-close');
const dispatchSummary = document.getElementById('dispatch-summary');

const FORM_COOLDOWN_MS = 10000;
let lastFormSubmitAt = 0;

function closeDispatchModal() {
  dispatchModal.classList.remove('open');
  dispatchModal.setAttribute('aria-hidden', 'true');
}

contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  // Honeypot check
  const honeypot = contactForm.website?.value;
  if (honeypot) return;

  const now = Date.now();
  if (now - lastFormSubmitAt < FORM_COOLDOWN_MS) {
    showToast('[WAIT] COOLDOWN_ACTIVE — please wait a few seconds');
    return;
  }

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    showToast('[ERR] ALL_FIELDS_REQUIRED');
    return;
  }

  if (name.length > 80 || email.length > 120 || message.length > 1500) {
    showToast('[ERR] INPUT_EXCEEDS_MAX_LENGTH');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    showToast('[ERR] INVALID_EMAIL_FORMAT');
    return;
  }

  lastFormSubmitAt = now;
  dispatchSummary.textContent = `Sender "${name}" (${email}) logged. Precision will answer.`;
  dispatchModal.classList.add('open');
  dispatchModal.setAttribute('aria-hidden', 'false');
  contactForm.reset();
  setTimeout(() => dispatchClose?.focus(), 40);
});

dispatchClose?.addEventListener('click', closeDispatchModal);
dispatchModal?.addEventListener('click', e => {
  if (e.target === dispatchModal) closeDispatchModal();
});

/* ─────────────────────────────────────────────────────
   10. KEYBOARD-FIRST NAVIGATION (1-4, /, ESC)
   ───────────────────────────────────────────────────── */
const sectionShortcuts = {
  '1': 'about',
  '2': 'projects',
  '3': 'tech',
  '4': 'contact'
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProjectDrawer();
    closeTerminalModal();
    closeDispatchModal();
    toggleAccentPopover(false);
    return;
  }

  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) {
    return;
  }

  if (e.key === '/') {
    e.preventDefault();
    openTerminalModal();
    return;
  }

  if (sectionShortcuts[e.key]) {
    e.preventDefault();
    document.getElementById(sectionShortcuts[e.key])?.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ─────────────────────────────────────────────────────
   11. PORTRAIT TVL / RANDOMIZED HOVER GLITCH
   ───────────────────────────────────────────────────── */
(function initPortraitTvGlitch() {
  const frame = document.getElementById('portrait-tv-frame');
  if (!frame) return;

  const img = frame.querySelector('.portrait-img');
  const slice = frame.querySelector('.portrait-glitch-slice');
  if (!img || !slice) return;

  let hoverActive = false;
  let loopTimer = null;
  let burstTimer = null;

  function resetGlitch() {
    img.style.transform = '';
    img.style.filter = '';
    slice.style.opacity = '0';
    slice.style.clipPath = '';
    slice.style.transform = '';
    slice.style.filter = '';
  }

  function triggerMicroGlitch() {
    if (!hoverActive) return;

    const shiftX = (Math.random() - 0.5) * 5; // subtle +-2.5px
    const shiftY = (Math.random() - 0.5) * 2; // subtle +-1px
    const topPct = Math.floor(Math.random() * 72);
    const heightPct = 6 + Math.floor(Math.random() * 14);
    const bottomPct = Math.max(0, 100 - topPct - heightPct);
    const sliceShift = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 4);

    img.style.transform = `translate(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px)`;
    img.style.filter = 'saturate(1.12) contrast(1.1) brightness(1.06)';

    slice.style.opacity = '0.85';
    slice.style.clipPath = `inset(${topPct}% 0 ${bottomPct}% 0)`;
    slice.style.transform = `translateX(${sliceShift.toFixed(1)}px)`;
    slice.style.filter = 'drop-shadow(2px 0 0 rgba(70,162,218,0.65)) drop-shadow(-2px 0 0 rgba(255,70,100,0.45))';

    const burstDuration = 55 + Math.random() * 65;
    burstTimer = setTimeout(() => {
      resetGlitch();
      if (hoverActive) {
        const nextDelay = 130 + Math.random() * 320;
        loopTimer = setTimeout(triggerMicroGlitch, nextDelay);
      }
    }, burstDuration);
  }

  frame.addEventListener('mouseenter', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hoverActive = true;
    triggerMicroGlitch();
  });

  frame.addEventListener('mouseleave', () => {
    hoverActive = false;
    clearTimeout(loopTimer);
    clearTimeout(burstTimer);
    resetGlitch();
  });
})();
