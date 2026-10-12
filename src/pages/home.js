/* ── Home Page ─────────────────────────────────────── */

function renderHome() {
  const app = document.getElementById("app");
  const m = SITE.meta;
  const h = SITE.home;
  const frag = document.createDocumentFragment();

  /* Hero — brand, role, one sentence, CTAs, pipeline visual */
  const hero = U.el("section", "hero-section");
  const layout = U.el("div", "hero-layout");

  const info = U.el("div", "hero-text");
  info.appendChild(U.el("span", "hero-greeting", U.esc(h.hero.greeting)));
  info.appendChild(U.el("h1", "hero-name", U.esc(m.name)));
  info.appendChild(U.el("p", "hero-role", U.esc(m.title)));
  info.appendChild(U.el("p", "hero-support", U.esc(h.hero.support || m.tagline)));

  const cta = U.el("div", "hero-cta");
  const viewWork = U.el("a", "cta-primary", "View work →");
  viewWork.href = "#/projects";
  const contact = U.el("a", "cta-secondary", "Contact");
  contact.href = "mailto:" + m.email;
  cta.appendChild(viewWork);
  cta.appendChild(contact);
  info.appendChild(cta);

  const pills = U.el("div", "hero-contact");
  if (m.linkedin) {
    const a = U.el("a", "pill", U.icons.linkedin + " LinkedIn");
    a.href = m.linkedin; a.target = "_blank"; a.rel = "noopener";
    pills.appendChild(a);
  }
  if (m.github) {
    const a = U.el("a", "pill", U.icons.github + " GitHub");
    a.href = m.github; a.target = "_blank"; a.rel = "noopener";
    pills.appendChild(a);
  }
  if (m.email) {
    const btn = U.el("button", "pill", U.icons.mail + " Email");
    btn.onclick = () => U.copy(m.email);
    pills.appendChild(btn);
  }
  info.appendChild(pills);
  layout.appendChild(info);

  /* Dominant visual: agent pipeline (visible immediately — above the fold) */
  const visual = U.el("div", "hero-visual");
  const pipeline = U.el("div", "pipeline");
  const nodes = h.hero.pipeline || [
    { label: "User Intent", sub: "Natural language" },
    { label: "LangGraph Agent", sub: "Plan · tool-call · reason" },
    { label: "Guarded Tools", sub: "BQ · RAG · CI/CD" },
    { label: "Streamed Answer", sub: "SSE · metrics · RCA" },
  ];
  nodes.forEach((n, i) => {
    const node = U.el("div", "pipeline-node");
    node.appendChild(U.el("span", "pipeline-dot"));
    const labels = U.el("div", "");
    labels.appendChild(U.el("span", "pipeline-label", U.esc(n.label)));
    if (n.sub) labels.appendChild(U.el("span", "pipeline-sub", U.esc(n.sub)));
    node.appendChild(labels);
    pipeline.appendChild(node);
    if (i < nodes.length - 1) pipeline.appendChild(U.el("div", "pipeline-edge"));
  });
  visual.appendChild(pipeline);
  layout.appendChild(visual);

  hero.appendChild(layout);
  frag.appendChild(hero);

  /* Metrics below the fold */
  if (h.highlights && h.highlights.length) {
    const sec = Shared.sectionBlock("Impact at a Glance", U.icons.barChart);
    sec.appendChild(Shared.metricsGrid(h.highlights));
    frag.appendChild(sec);
  }

  /* Featured projects — GenAI first via data order */
  const previewSec = Shared.sectionBlock("Featured Work", U.icons.rocket);
  const previewGrid = U.el("div", "project-preview-grid");
  SITE.projects.slice(0, 4).forEach((p) => {
    const card = U.el("a", "preview-card reveal");
    card.href = "#/projects/" + p.slug;
    const iconSvg = U.icons[p.icon] || "";
    card.appendChild(U.el("span", "preview-icon", iconSvg));
    card.appendChild(U.el("h3", "", U.esc(p.title)));
    card.appendChild(U.el("p", "", U.esc(p.subtitle)));
    previewGrid.appendChild(card);
  });
  const viewAll = U.el("a", "view-all-link", "View all projects →");
  viewAll.href = "#/projects";
  previewSec.appendChild(previewGrid);
  previewSec.appendChild(viewAll);
  frag.appendChild(previewSec);
  frag.appendChild(Shared.pageNav("home"));

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
