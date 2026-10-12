/* ── Shared UI components used across pages ────────── */

const Shared = {
  /** Metrics / highlights counter grid */
  metricsGrid(items, extraCls) {
    const grid = U.el("div", "metrics-grid " + (extraCls || ""));
    items.forEach((m) => {
      const card = U.el("div", "metric-card reveal");
      card.appendChild(U.el("div", "metric-value", U.esc(m.value)));
      card.appendChild(U.el("div", "metric-label", U.esc(m.label)));
      grid.appendChild(card);
    });
    return grid;
  },

  /** Tech stack badge row */
  techBadges(items) {
    const row = U.el("div", "tech-row");
    items.forEach((s) => {
      const badge = U.el("div", "tech-badge");
      if (s.icon) {
        if (s.icon.startsWith("http") || s.icon.startsWith("data:")) {
          const img = document.createElement("img");
          img.src = s.icon; img.alt = s.name; img.loading = "lazy";
          badge.appendChild(img);
        } else if (U.icons[s.icon]) {
          const iconEl = U.el("span", "tech-badge-svg", U.icons[s.icon]);
          badge.appendChild(iconEl);
        }
      }
      badge.appendChild(U.el("span", "", U.esc(s.name)));
      row.appendChild(badge);
    });
    return row;
  },

  /** Section wrapper with title + icon */
  sectionBlock(title, icon) {
    const sec = U.el("div", "content-section reveal");
    const header = U.el("div", "section-head");
    if (icon) header.appendChild(U.el("span", "section-icon", icon));
    header.appendChild(U.el("h2", "", U.esc(title)));
    sec.appendChild(header);
    return sec;
  },

  /** Page header with optional back button */
  pageHeader(title, subtitle, backRoute) {
    const header = U.el("div", "page-header");
    if (backRoute) {
      const btn = U.el("a", "back-btn", U.icons.arrowLeft + " Back");
      btn.href = "#/" + backRoute;
      header.appendChild(btn);
    }
    header.appendChild(U.el("h1", "page-title", U.esc(title)));
    if (subtitle) header.appendChild(U.el("p", "page-subtitle", U.esc(subtitle)));
    return header;
  },

  /** Feature bullet list */
  featureList(items) {
    const ul = U.el("ul", "feature-list");
    items.forEach((f) => ul.appendChild(U.el("li", "", U.esc(f))));
    return ul;
  },

  /** Tag pills */
  tags(items) {
    const wrap = U.el("div", "tag-row");
    items.forEach((t) => wrap.appendChild(U.el("span", "tag", U.esc(t))));
    return wrap;
  },

  /** Page-level prev / next navigation bar */
  pageNav(currentId) {
    const pages = SITE.pages;
    const idx = pages.findIndex((p) => p.id === currentId);
    if (idx < 0) return document.createDocumentFragment();

    const nav = U.el("nav", "page-nav reveal");
    const prev = idx > 0 ? pages[idx - 1] : null;
    const next = idx < pages.length - 1 ? pages[idx + 1] : null;

    if (prev) {
      const a = U.el("a", "page-nav-link prev", "");
      a.href = "#/" + (prev.id === "home" ? "" : prev.id);
      a.innerHTML = U.icons.arrowLeft + '<span class="page-nav-dir">Previous</span><span class="page-nav-label">' + U.esc(prev.label) + "</span>";
      nav.appendChild(a);
    } else {
      nav.appendChild(U.el("span", "page-nav-spacer", ""));
    }

    if (next) {
      const a = U.el("a", "page-nav-link next", "");
      a.href = "#/" + (next.id === "home" ? "" : next.id);
      a.innerHTML = '<span class="page-nav-dir">Next</span><span class="page-nav-label">' + U.esc(next.label) + "</span>" + U.icons.arrowRight;
      nav.appendChild(a);
    }

    return nav;
  },
};
