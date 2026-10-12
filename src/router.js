/* ── Hash Router ──────────────────────────────────── */

(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const navLinks = document.getElementById("navLinks");
  const sidebarBrand = document.getElementById("sidebarBrand");
  const sidebarFooter = document.getElementById("sidebarFooter");
  const topbarBrand = document.getElementById("topbarBrand");
  const menuToggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("overlay");

  /* ── Build sidebar ─────────────────────────────── */
  function buildNav() {
    const m = SITE.meta;
    const brand = U.esc(m.shortName || m.name);
    sidebarBrand.innerHTML = `<a href="#/">${brand}<span>.</span></a>`;
    topbarBrand.textContent = m.name;

    SITE.pages.forEach((pg) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#/" + (pg.id === "home" ? "" : pg.id);
      const iconSvg = U.icons[pg.icon] || "";
      a.innerHTML = `<span class="nav-icon">${iconSvg}</span><span class="nav-label">${U.esc(pg.label)}</span>`;
      a.dataset.page = pg.id;
      li.appendChild(a);
      navLinks.appendChild(li);
    });

    sidebarFooter.innerHTML = `<p>© ${new Date().getFullYear()} ${U.esc(m.name)}</p>`;
  }

  /* ── Route table ───────────────────────────────── */
  function route() {
    const hash = window.location.hash || "#/";
    const pathAndQuery = hash.replace(/^#\/?/, "").replace(/\/$/, "");
    const path = pathAndQuery.split("?")[0];
    const parts = path.split("/").filter(Boolean);

    // Close mobile nav
    sidebar.classList.remove("open");
    menuToggle.classList.remove("active");
    overlay.classList.remove("show");

    // Close any open file viewer modal
    const fvModal = document.getElementById("file-viewer-modal");
    if (fvModal) fvModal.remove();

    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Route matching
    if (!path || path === "") {
      renderHome();
      setActiveNav("home");
    } else if (path === "experience") {
      renderExperience();
      setActiveNav("experience");
    } else if (path === "projects" && parts.length === 1) {
      renderProjects();
      setActiveNav("projects");
    } else if (parts[0] === "projects" && parts[1]) {
      renderProjectDetail(parts[1]);
      setActiveNav("projects");
    } else if (path === "skills") {
      renderSkills();
      setActiveNav("skills");
    } else if (path === "about") {
      renderAbout();
      setActiveNav("about");
    } else if (parts[0] === "documents") {
      renderDocuments();
      setActiveNav("documents");
    } else if (SITE.customPages && SITE.customPages[path]) {
      renderCustomPage(path);
      setActiveNav(path);
    } else {
      renderHome();
      setActiveNav("home");
    }

    // Update page title
    document.title = getPageTitle(path);
  }

  function getPageTitle(path) {
    const name = SITE.meta.name;
    if (!path) return name + " — " + SITE.meta.title;
    const pg = SITE.pages.find((p) => p.id === path);
    if (pg) return pg.label + " — " + name;
    return name;
  }

  function setActiveNav(pageId) {
    navLinks.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.dataset.page === pageId);
    });
  }

  /* ── Mobile menu toggle ────────────────────────── */
  function initMobileMenu() {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuToggle.classList.toggle("active");
      overlay.classList.toggle("show");
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuToggle.classList.remove("active");
      overlay.classList.remove("show");
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        sidebar.classList.remove("open");
        menuToggle.classList.remove("active");
        overlay.classList.remove("show");
      }
    });
  }

  /* ── Scroll-to-top button ──────────────────────── */
  function initScrollTop() {
    const btn = U.el("button", "scroll-top");
    btn.innerHTML = U.icons.arrowUp;
    btn.setAttribute("aria-label", "Scroll to top");
    btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.appendChild(btn);
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });
  }

  /* ── Boot ──────────────────────────────────────── */
  function init() {
    buildNav();
    initMobileMenu();
    initScrollTop();
    if (typeof initBot === "function") initBot();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
