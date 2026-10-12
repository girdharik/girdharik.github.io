/* ── Utility helpers shared across all pages ──────── */

const U = {
  /** Create an element with optional class and innerHTML */
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  /** XSS-safe text escaping */
  esc(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  },

  /** Parse "YYYY-MM" or "YYYY-MM-DD" → Date (local) */
  parseDate(str) {
    if (!str) return null;
    const m = String(str).trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
    if (!m) return null;
    const y = +m[1], mo = +m[2] - 1, d = m[3] ? +m[3] : 1;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  },

  /** Exact date label e.g. "21 Feb 2024" */
  exactDateLabel(str) {
    const dt = U.parseDate(str);
    if (!dt) return "";
    return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  },

  /** Exact range for tooltips: "21 Feb 2024 – Present" */
  exactRange(startStr, endStr) {
    const s = U.exactDateLabel(startStr);
    if (!s) return "";
    const e = endStr ? U.exactDateLabel(endStr) : "Present";
    return `${s} – ${e}`;
  },

  /**
   * Display duration from exact or month dates.
   * Shows "Feb 2024 – Present · 2 yrs 9 mos" (LinkedIn-style inclusive months).
   * Accepts YYYY-MM or YYYY-MM-DD.
   */
  duration(startStr, endStr) {
    const start = U.parseDate(startStr);
    if (!start) return "";
    const end = endStr ? U.parseDate(endStr) : new Date();
    if (!end) return "";
    // Inclusive month count on calendar months
    let months = (end.getFullYear() - start.getFullYear()) * 12
      + (end.getMonth() - start.getMonth()) + 1;
    if (months < 1) months = 1;
    const y = Math.floor(months / 12);
    const m = months % 12;
    const sLabel = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const eLabel = endStr
      ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "Present";
    let dur = "";
    if (y > 0) dur += y + " yr" + (y > 1 ? "s" : "");
    if (m > 0) dur += (dur ? " " : "") + m + " mo" + (m !== 1 ? "s" : "");
    if (!dur) dur = "1 mo";
    return `${sLabel} – ${eLabel} · ${dur}`;
  },

  /** SVG icons used across the app */
  icons: {
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    messageCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
    certificate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 7h18"/><path d="M8 12h8"/><path d="M10 15h4"/><circle cx="12" cy="20" r="2"/><path d="m10 20-1.5 2"/><path d="m14 20 1.5 2"/></svg>',
    // Navigation icons
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    // Project icons
    chartLine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
    chartDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 15-5-5-4 4-3-3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
    microscope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    // Section icons
    barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
    fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    graduationCap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    // Extra
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
  },

  /** Copy to clipboard with toast */
  copy(text) {
    navigator.clipboard.writeText(text).then(() => U.toast("Copied: " + text)).catch(() => {
      const t = document.createElement("textarea");
      t.value = text; t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t); t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      U.toast("Copied: " + text);
    });
  },

  /** Show a toast notification */
  _toastEl: null,
  toast(msg) {
    if (!U._toastEl) {
      U._toastEl = U.el("div", "toast");
      document.body.appendChild(U._toastEl);
    }
    U._toastEl.textContent = msg;
    U._toastEl.classList.add("show");
    clearTimeout(U._toastEl._t);
    U._toastEl._t = setTimeout(() => U._toastEl.classList.remove("show"), 2200);
  },

  /** Animate elements into view with IntersectionObserver */
  observeReveal(container) {
    const els = container.querySelectorAll(".reveal");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
      } else {
        obs.observe(el);
      }
    });
  },

  /** Parse CSV text → { labels: string[], series: {name, values}[] }
   *  Row 0 = headers. Col 0 = labels. Remaining cols = data series.
   */
  parseCSV(text) {
    const lines = text.trim().split("\n").map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
    if (lines.length < 2) return { labels: [], series: [] };
    const headers = lines[0];
    const labels = [];
    const series = headers.slice(1).map(name => ({ name, values: [] }));
    for (let r = 1; r < lines.length; r++) {
      if (!lines[r][0]) continue;
      labels.push(lines[r][0]);
      series.forEach((s, i) => { s.values.push(parseFloat(lines[r][i + 1]) || 0); });
    }
    return { labels, series };
  },

  /** File type detection from extension */
  fileType(filename) {
    const ext = (filename || "").split(".").pop().toLowerCase();
    const types = { ipynb: "Jupyter Notebook", py: "Python", sql: "SQL", csv: "CSV", json: "JSON", md: "Markdown", txt: "Text" };
    return types[ext] || ext.toUpperCase();
  },

  /** File type icon SVG */
  fileIcon(filename) {
    const ext = (filename || "").split(".").pop().toLowerCase();
    if (ext === "ipynb") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>';
    if (ext === "py") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="m9 12 2 2 4-4"/></svg>';
    if (ext === "sql") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>';
    return U.icons.fileText;
  },

  /** Parse CSV into table format: { columns: string[], rows: string[][] } */
  parseTableCSV(text) {
    const lines = text.trim().split("\n").map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
    if (lines.length < 2) return { columns: [], rows: [] };
    return { columns: lines[0], rows: lines.slice(1) };
  },

  /** Basic syntax highlighting for code display */
  highlightCode(code, lang) {
    const lines = code.split("\n");
    const hl = lines.map(line => {
      let h = U.esc(line);
      if (lang === "python" || lang === "py") {
        /* Order matters: keywords first (no HTML tags yet), then strings, then comments */
        h = h.replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|self|with|as|try|except|finally|raise|yield|lambda|pass|break|continue|print)\b/g, '<span class="hl-kw">$1</span>');
        h = h.replace(/(@\w+)/g, '<span class="hl-dec">$1</span>');
        h = h.replace(/(&#39;[^<]*?&#39;|&quot;[^<]*?&quot;)/g, '<span class="hl-str">$1</span>');
        h = h.replace(/(^|[ \t])(#[^<].*)$/gm, '$1<span class="hl-cmt">$2</span>');
      } else if (lang === "sql") {
        h = h.replace(/\b(SELECT|FROM|WHERE|CREATE|TABLE|INSERT|UPDATE|DELETE|ALTER|DROP|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|INT64|STRING|FLOAT64|BOOL|DATE|TIMESTAMP|STRUCT|ARRAY|IF|EXISTS|PARTITION|BY|CLUSTER|OPTIONS|DESCRIPTION|GROUP|ORDER|HAVING|LIMIT|UNION|ALL|DISTINCT|CASE|WHEN|THEN|ELSE|END|IN|BETWEEN|LIKE|IS|SET|VALUES|INTO|PRIMARY|KEY|DEFAULT|CURRENT_TIMESTAMP)\b/gi, '<span class="hl-kw">$1</span>');
        h = h.replace(/(&#39;[^<]*?&#39;)/g, '<span class="hl-str">$1</span>');
        h = h.replace(/(^|[ \t])(--.*)$/gm, '$1<span class="hl-cmt">$2</span>');
      }
      return h;
    });
    return hl.join("\n");
  },

  /** Show file viewer modal overlay */
  showFileViewer(filename, content) {
    const existing = document.getElementById("file-viewer-modal");
    if (existing) existing.remove();

    const ext = (filename || "").split(".").pop().toLowerCase();
    const modal = U.el("div", "fv-overlay");
    modal.id = "file-viewer-modal";

    const container = U.el("div", "fv-container");

    /* Header bar */
    const header = U.el("div", "fv-header");
    const titleArea = U.el("div", "fv-title-area");
    titleArea.appendChild(U.el("span", "fv-icon", U.fileIcon(filename)));
    const titleText = U.el("div", "fv-title-text");
    titleText.appendChild(U.el("span", "fv-name", U.esc(filename)));
    titleText.appendChild(U.el("span", "fv-type-badge", U.fileType(filename)));
    titleArea.appendChild(titleText);
    header.appendChild(titleArea);

    const actions = U.el("div", "fv-actions");
    const copyBtn = U.el("button", "fv-btn", U.icons.copy + " Copy");
    copyBtn.onclick = () => { U.copy(content); copyBtn.innerHTML = U.icons.copy + " Copied!"; setTimeout(() => copyBtn.innerHTML = U.icons.copy + " Copy", 1500); };
    actions.appendChild(copyBtn);
    const closeBtn = U.el("button", "fv-btn fv-close-btn", U.icons.close);
    closeBtn.onclick = () => modal.remove();
    actions.appendChild(closeBtn);
    header.appendChild(actions);
    container.appendChild(header);

    /* Body */
    const body = U.el("div", "fv-body");

    if (ext === "csv") {
      const parsed = U.parseTableCSV(content);
      if (parsed.columns.length) {
        const wrap = U.el("div", "table-scroll");
        const table = document.createElement("table");
        table.className = "data-table";
        const thead = document.createElement("thead");
        const hr = document.createElement("tr");
        parsed.columns.forEach(col => { const th = document.createElement("th"); th.textContent = col; hr.appendChild(th); });
        thead.appendChild(hr);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        parsed.rows.forEach(row => {
          const tr = document.createElement("tr");
          row.forEach(cell => { const td = document.createElement("td"); td.textContent = cell; tr.appendChild(td); });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        body.appendChild(wrap);
      }
    } else if (ext === "ipynb") {
      try {
        const nb = JSON.parse(content);
        (nb.cells || []).forEach(cell => {
          const cellDiv = U.el("div", "nb-cell nb-" + cell.cell_type);
          const src = Array.isArray(cell.source) ? cell.source.join("") : (cell.source || "");
          if (cell.cell_type === "code") {
            const pre = U.el("pre", "code-block nb-code-block");
            const code = document.createElement("code");
            code.innerHTML = U.highlightCode(src, "python");
            pre.appendChild(code);
            cellDiv.appendChild(pre);
          } else {
            cellDiv.innerHTML = '<div class="nb-md">' + U.esc(src).replace(/\n/g, "<br>") + "</div>";
          }
          body.appendChild(cellDiv);
        });
      } catch (e) { body.appendChild(U.el("pre", "code-block", U.esc(content))); }
    } else {
      const lang = { py: "python", sql: "sql", js: "javascript" }[ext] || "";
      const pre = U.el("pre", "code-block");
      const code = document.createElement("code");
      code.innerHTML = lang ? U.highlightCode(content, lang) : U.esc(content);
      pre.appendChild(code);

      /* Line numbers */
      const lines = content.split("\n");
      const lineNums = U.el("div", "line-numbers");
      lines.forEach((_, i) => lineNums.appendChild(U.el("span", "", String(i + 1))));
      const codeWrap = U.el("div", "code-with-lines");
      codeWrap.appendChild(lineNums);
      codeWrap.appendChild(pre);
      body.appendChild(codeWrap);
    }

    container.appendChild(body);
    modal.appendChild(container);

    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    const escHandler = e => { if (e.key === "Escape") { modal.remove(); document.removeEventListener("keydown", escHandler); } };
    document.addEventListener("keydown", escHandler);

    document.body.appendChild(modal);
  },
};
