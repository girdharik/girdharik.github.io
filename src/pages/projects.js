/* ── Projects listing page ────────────────────────── */

function renderProjects() {
  const app = document.getElementById("app");
  const frag = document.createDocumentFragment();

  frag.appendChild(Shared.pageHeader("Projects", "Frameworks & systems I've built end-to-end"));

  const grid = U.el("div", "projects-grid");

  SITE.projects.forEach((p) => {
    const card = U.el("div", "project-card reveal");

    const top = U.el("div", "project-card-top");
    const iconSvg = U.icons[p.icon] || "";
    top.appendChild(U.el("span", "project-icon", iconSvg));
    const hasDetail = p.detail && p.detail.sections;
    if (hasDetail) {
      top.appendChild(U.el("span", "project-badge", "Deep Dive →"));
    }
    card.appendChild(top);

    card.appendChild(U.el("h3", "project-title", U.esc(p.title)));
    card.appendChild(U.el("p", "project-subtitle", U.esc(p.subtitle || "")));
    card.appendChild(U.el("p", "project-desc", U.esc(p.description)));

    if (p.tags && p.tags.length) {
      card.appendChild(Shared.tags(p.tags));
    }

    // Make card clickable if detail exists
    if (hasDetail) {
      card.classList.add("clickable");
      card.addEventListener("click", () => {
        window.location.hash = "#/projects/" + p.slug;
      });
    }

    grid.appendChild(card);
  });

  frag.appendChild(grid);
  frag.appendChild(Shared.pageNav("projects"));
  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
