/* ── About Page ───────────────────────────────────── */

function renderAbout() {
  const app = document.getElementById("app");
  const m = SITE.meta;
  const a = SITE.about;
  const frag = document.createDocumentFragment();

  frag.appendChild(Shared.pageHeader("About Me"));

  /* Bio */
  const bioSec = Shared.sectionBlock("Bio", U.icons.fileText);
  a.bio.forEach((p) => bioSec.appendChild(U.el("p", "bio-text", U.esc(p))));
  frag.appendChild(bioSec);

  /* Education + Certifications — shared row for aligned columns */
  const hasEdu = a.education && a.education.length;
  const hasCerts = a.certifications && a.certifications.length;
  const credentials = U.el("div", "about-credentials");

  if (hasEdu) {
    const eduSec = Shared.sectionBlock("Education", U.icons.graduationCap);
    eduSec.classList.add("about-cred-block");
    const grid = U.el("div", "edu-grid");
    a.education.forEach((e) => {
      const card = U.el("div", "edu-card reveal");
      if (e.logo) {
        const img = document.createElement("img");
        img.src = e.logo; img.alt = e.institution; img.loading = "lazy";
        card.appendChild(img);
      }
      const info = U.el("div", "edu-info");
      info.appendChild(U.el("h3", "", U.esc(e.degree)));
      info.appendChild(U.el("p", "edu-inst", U.esc(e.institution)));
      info.appendChild(U.el("p", "edu-period", U.esc(e.period)));
      card.appendChild(info);
      grid.appendChild(card);
    });
    eduSec.appendChild(grid);
    credentials.appendChild(eduSec);
  }

  /* ── Certifications Carousel ─────────────────── */
  if (hasCerts) {
    const certSec = Shared.sectionBlock("Certifications", U.icons.certificate);
    certSec.classList.add("about-cred-block");
    const certs = a.certifications;
    let idx = 0;

    const carousel = U.el("div", "cert-carousel reveal");

    /* Viewport */
    const viewport = U.el("div", "cert-viewport");
    const track = U.el("div", "cert-track");

    certs.forEach((c, i) => {
      const slide = U.el("div", "cert-slide");
      const frame = U.el("div", "cert-frame");

      /* If image exists, show it — else show styled placeholder */
      const img = document.createElement("img");
      img.alt = c.name; img.loading = "lazy"; img.className = "cert-img";
      if (c.image) {
        img.src = c.image;
        img.onerror = () => { img.style.display = "none"; frame.querySelector(".cert-placeholder").style.display = "flex"; };
      } else {
        img.style.display = "none";
      }
      frame.appendChild(img);

      const placeholder = U.el("div", "cert-placeholder");
      if (!c.image) placeholder.style.display = "flex";
      else placeholder.style.display = "none";
      if (c.logo) {
        const logo = document.createElement("img");
        logo.src = c.logo; logo.alt = c.provider; logo.loading = "lazy"; logo.className = "cert-ph-logo";
        placeholder.appendChild(logo);
      }
      placeholder.appendChild(U.el("h3", "cert-ph-name", U.esc(c.name)));
      placeholder.appendChild(U.el("p", "cert-ph-provider", U.esc(c.provider)));
      frame.appendChild(placeholder);

      slide.appendChild(frame);

      /* Caption */
      const caption = U.el("div", "cert-caption");
      caption.appendChild(U.el("span", "cert-cap-name", U.esc(c.name)));
      let providerLine = c.provider || "";
      if (c.issued) {
        const issued = U.exactDateLabel(c.issued) || c.issued;
        providerLine += " · Issued " + issued;
      }
      caption.appendChild(U.el("span", "cert-cap-provider", U.esc(providerLine)));
      if (c.pdf) {
        const link = U.el("a", "cert-cap-pdf", "View PDF →");
        link.href = c.pdf;
        link.target = "_blank";
        link.rel = "noopener";
        caption.appendChild(link);
      }
      slide.appendChild(caption);

      track.appendChild(slide);
    });

    viewport.appendChild(track);
    carousel.appendChild(viewport);

    /* Navigation */
    const nav = U.el("div", "cert-nav");
    const prevBtn = U.el("button", "cert-nav-btn", U.icons.arrowLeft);
    prevBtn.setAttribute("aria-label", "Previous certificate");
    const nextBtn = U.el("button", "cert-nav-btn", U.icons.arrowRight);
    nextBtn.setAttribute("aria-label", "Next certificate");

    const dots = U.el("div", "cert-dots");
    certs.forEach((_, i) => {
      const dot = U.el("button", "cert-dot" + (i === 0 ? " active" : ""), "");
      dot.setAttribute("aria-label", "Go to certificate " + (i + 1));
      dot.onclick = () => goTo(i);
      dots.appendChild(dot);
    });

    const counter = U.el("span", "cert-counter", "1 / " + certs.length);

    function goTo(n) {
      idx = ((n % certs.length) + certs.length) % certs.length;
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      dots.querySelectorAll(".cert-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
      counter.textContent = (idx + 1) + " / " + certs.length;
    }

    prevBtn.onclick = () => goTo(idx - 1);
    nextBtn.onclick = () => goTo(idx + 1);

    nav.appendChild(prevBtn);
    nav.appendChild(dots);
    nav.appendChild(counter);
    nav.appendChild(nextBtn);
    carousel.appendChild(nav);

    certSec.appendChild(carousel);
    credentials.appendChild(certSec);
  }

  if (hasEdu || hasCerts) frag.appendChild(credentials);

  /* ── Get in Touch ─────────────────── */
  const contactSec = U.el("div", "content-section reveal");
  const contactHero = U.el("div", "contact-hero");

  /* Heading area */
  const headArea = U.el("div", "contact-head-area");
  headArea.appendChild(U.el("span", "contact-sparkle", U.icons.sparkles));
  headArea.appendChild(U.el("h2", "contact-heading", "Let's Connect"));
  contactHero.appendChild(headArea);
  contactHero.appendChild(U.el("p", "contact-subtitle", "Hiring for AI / GenAI, MLOps, or GCP data roles — or want to talk shop? I'd love to hear from you."));

  /* Primary CTA — email */
  if (m.email) {
    const cta = document.createElement("a");
    cta.href = "mailto:" + m.email;
    cta.className = "contact-cta";
    const ctaInner = U.el("span", "contact-cta-inner");
    ctaInner.appendChild(U.el("span", "contact-cta-icon", U.icons.send));
    const ctaText = U.el("span", "contact-cta-text");
    ctaText.appendChild(U.el("span", "contact-cta-label", "Say Hello"));
    ctaText.appendChild(U.el("span", "contact-cta-email", U.esc(m.email)));
    ctaInner.appendChild(ctaText);
    cta.appendChild(ctaInner);
    contactHero.appendChild(cta);
  }

  /* Info pills row */
  const pillRow = U.el("div", "contact-pills");
  if (m.location) {
    const pill = U.el("div", "contact-pill");
    pill.appendChild(U.el("span", "contact-pill-icon", U.icons.location));
    pill.appendChild(U.el("span", "", U.esc(m.location)));
    pillRow.appendChild(pill);
  }
  if (m.phone) {
    const pill = U.el("div", "contact-pill clickable");
    pill.appendChild(U.el("span", "contact-pill-icon", U.icons.phone));
    pill.appendChild(U.el("span", "", U.esc(m.phone)));
    pill.onclick = () => U.copy(m.phone);
    pill.style.cursor = "pointer";
    pillRow.appendChild(pill);
  }
  contactHero.appendChild(pillRow);

  /* Social buttons */
  const socials = U.el("div", "contact-socials");
  if (m.linkedin) {
    const btn = document.createElement("a");
    btn.href = m.linkedin; btn.target = "_blank"; btn.rel = "noopener";
    btn.className = "contact-social-btn linkedin-btn";
    btn.innerHTML = U.icons.linkedin;
    btn.appendChild(U.el("span", "", "LinkedIn"));
    socials.appendChild(btn);
  }
  if (m.github) {
    const btn = document.createElement("a");
    btn.href = m.github; btn.target = "_blank"; btn.rel = "noopener";
    btn.className = "contact-social-btn github-btn";
    btn.innerHTML = U.icons.github;
    btn.appendChild(U.el("span", "", "GitHub"));
    socials.appendChild(btn);
  }
  if (m.email) {
    const btn = document.createElement("a");
    btn.href = "mailto:" + m.email;
    btn.className = "contact-social-btn email-btn";
    btn.innerHTML = U.icons.mail;
    btn.appendChild(U.el("span", "", "Email"));
    socials.appendChild(btn);
  }
  contactHero.appendChild(socials);

  /* Availability badge */
  const badge = U.el("div", "contact-availability");
  badge.appendChild(U.el("span", "availability-dot", ""));
  badge.appendChild(U.el("span", "", "Available for opportunities"));
  contactHero.appendChild(badge);

  contactSec.appendChild(contactHero);
  frag.appendChild(contactSec);
  frag.appendChild(Shared.pageNav("about"));

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}
