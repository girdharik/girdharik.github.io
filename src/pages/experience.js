/* ── Experience Page ──────────────────────────────── */

function renderExperience() {
  const app = document.getElementById("app");
  const frag = document.createDocumentFragment();

  frag.appendChild(Shared.pageHeader("Experience", "My professional journey"));

  const timeline = U.el("div", "timeline");

  SITE.experience.forEach((job, i) => {
    const item = U.el("div", "timeline-item reveal");
    item.appendChild(U.el("div", "timeline-dot" + (i === 0 ? " current" : "")));

    const card = U.el("div", "job-card");

    // Header
    const header = U.el("div", "job-card-header");
    if (job.logo) {
      const logo = document.createElement("img");
      logo.src = job.logo; logo.alt = job.company;
      logo.className = "company-logo"; logo.loading = "lazy";
      header.appendChild(logo);
    }
    const info = U.el("div", "company-info");
    info.appendChild(U.el("h3", "", U.esc(job.company)));
    info.appendChild(U.el("span", "company-meta", U.esc(job.location || "")));
    header.appendChild(info);
    card.appendChild(header);

    // Roles
    job.roles.forEach((role) => {
      const block = U.el("div", "role-block");
      const row = U.el("div", "role-title-row");
      row.appendChild(U.el("h4", "", U.esc(role.title)));
      const durWrap = U.el("div", "role-duration-wrap");
      const dur = U.el("span", "role-duration", U.duration(role.start, role.end));
      const exact = U.exactRange(role.start, role.end);
      if (exact) {
        dur.title = exact;
        dur.setAttribute("aria-label", exact);
        durWrap.appendChild(dur);
        durWrap.appendChild(U.el("span", "role-exact", U.esc(exact)));
      } else {
        durWrap.appendChild(dur);
      }
      row.appendChild(durWrap);
      block.appendChild(row);

      if (role.bullets && role.bullets.length) {
        const ul = U.el("ul", "role-bullets");
        role.bullets.forEach((b) => ul.appendChild(U.el("li", "", U.esc(b))));
        block.appendChild(ul);
      }
      card.appendChild(block);
    });

    item.appendChild(card);
    timeline.appendChild(item);
  });

  frag.appendChild(timeline);
  frag.appendChild(Shared.pageNav("experience"));
  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
