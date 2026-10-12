/* ── Skills Page ──────────────────────────────────── */

function renderSkills() {
  const app = document.getElementById("app");
  const frag = document.createDocumentFragment();

  frag.appendChild(Shared.pageHeader("Skills & Technologies", "Ability-backed keywords for AI / GenAI, MLOps, and GCP Data Engineer roles"));

  SITE.skills.forEach((group) => {
    const sec = U.el("div", "skill-group reveal");
    sec.appendChild(U.el("h3", "skill-group-title", U.esc(group.category)));
    sec.appendChild(Shared.techBadges(group.items));
    frag.appendChild(sec);
  });

  frag.appendChild(Shared.pageNav("skills"));
  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
