/* ── Custom / Dynamic Page Renderer ───────────────── */
/* Renders pages defined in SITE.customPages via the admin panel.
   Each custom page has sections (text, metrics, features, tech, timeline, gallery). */

function renderCustomPage(pageId) {
  const app = document.getElementById("app");
  const pageDef = (SITE.customPages || {})[pageId];
  if (!pageDef) { renderHome(); return; }

  const frag = document.createDocumentFragment();

  // Page header
  frag.appendChild(Shared.pageHeader(pageDef.title || pageId, pageDef.subtitle || ""));

  // Render each section
  (pageDef.sections || []).forEach((s) => {
    switch (s.type) {
      case "text": {
        const sec = Shared.sectionBlock(s.title || "", s.icon ? U.icons[s.icon] : "");
        (s.content || []).forEach((p) => sec.appendChild(U.el("p", "section-text", U.esc(p))));
        frag.appendChild(sec);
        break;
      }
      case "metrics": {
        const sec = Shared.sectionBlock(s.title || "Key Metrics", U.icons.barChart);
        sec.appendChild(Shared.metricsGrid(s.items || []));
        frag.appendChild(sec);
        break;
      }
      case "features": {
        const sec = Shared.sectionBlock(s.title || "Features", U.icons.target);
        sec.appendChild(Shared.featureList(s.items || []));
        frag.appendChild(sec);
        break;
      }
      case "tech": {
        const sec = Shared.sectionBlock(s.title || "Technologies", U.icons.tools);
        sec.appendChild(Shared.techBadges(s.items || []));
        frag.appendChild(sec);
        break;
      }
      case "timeline": {
        const sec = Shared.sectionBlock(s.title || "Timeline", U.icons.briefcase);
        const tl = U.el("div", "timeline");
        (s.steps || []).forEach((step) => {
          const item = U.el("div", "timeline-item reveal");
          item.appendChild(U.el("div", "timeline-dot", ""));
          const body = U.el("div", "timeline-body");
          body.appendChild(U.el("h3", "", U.esc(step.title)));
          if (step.desc) body.appendChild(U.el("p", "", U.esc(step.desc)));
          item.appendChild(body);
          tl.appendChild(item);
        });
        sec.appendChild(tl);
        frag.appendChild(sec);
        break;
      }
      case "cards": {
        const sec = Shared.sectionBlock(s.title || "", s.icon ? U.icons[s.icon] : "");
        const grid = U.el("div", "custom-cards-grid");
        (s.items || []).forEach((card) => {
          const c = U.el("div", "custom-card reveal");
          if (card.icon && U.icons[card.icon]) c.appendChild(U.el("span", "custom-card-icon", U.icons[card.icon]));
          c.appendChild(U.el("h3", "", U.esc(card.title || "")));
          if (card.subtitle) c.appendChild(U.el("p", "text-muted", U.esc(card.subtitle)));
          if (card.description) c.appendChild(U.el("p", "", U.esc(card.description)));
          grid.appendChild(c);
        });
        sec.appendChild(grid);
        frag.appendChild(sec);
        break;
      }
      case "links": {
        const sec = Shared.sectionBlock(s.title || "Links", U.icons.external);
        const list = U.el("div", "custom-links");
        (s.items || []).forEach((lnk) => {
          const a = U.el("a", "custom-link reveal", "");
          a.href = lnk.url || "#";
          a.target = "_blank"; a.rel = "noopener";
          a.innerHTML = U.icons.external + " " + U.esc(lnk.label || lnk.url);
          if (lnk.description) {
            a.innerHTML += '<span class="text-muted" style="margin-left:0.5rem;font-size:0.85em">' + U.esc(lnk.description) + '</span>';
          }
          list.appendChild(a);
        });
        sec.appendChild(list);
        frag.appendChild(sec);
        break;
      }
      default:
        break;
    }
  });

  // Prev/next navigation
  frag.appendChild(Shared.pageNav(pageId));

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
