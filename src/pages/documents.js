/* ── Documents (wiki-style pages) ───────────────── */

function ensureDocs() {
  if (!SITE.docs) SITE.docs = { folders: [], items: [] };
  if (!Array.isArray(SITE.docs.folders)) SITE.docs.folders = [];
  if (!Array.isArray(SITE.docs.items)) SITE.docs.items = [];
  return SITE.docs;
}

function renderMarkdown(src) {
  const raw = src || "";
  if (typeof marked !== "undefined" && marked.parse) {
    try {
      return marked.parse(raw, { breaks: true, gfm: true });
    } catch (_) { /* fall through */ }
  }
  return "<pre class=\"doc-fallback\">" + U.esc(raw) + "</pre>";
}

function renderDocumentsList(folderFilter) {
  const app = document.getElementById("app");
  const docs = ensureDocs();
  const frag = document.createDocumentFragment();

  frag.appendChild(Shared.pageHeader(
    "Documents",
    "Notes, guides, and write-ups — organized by folder"
  ));

  const layout = U.el("div", "docs-layout");

  /* Folders sidebar */
  const side = U.el("aside", "docs-side reveal");
  const allBtn = U.el("button", "docs-folder-btn" + (!folderFilter ? " active" : ""));
  allBtn.type = "button";
  allBtn.textContent = "All documents";
  allBtn.onclick = () => { location.hash = "#/documents"; };
  side.appendChild(allBtn);

  docs.folders.forEach((f) => {
    const count = docs.items.filter((d) => d.published !== false && d.folderId === f.id).length;
    const btn = U.el("button", "docs-folder-btn" + (folderFilter === f.id ? " active" : ""));
    btn.type = "button";
    btn.innerHTML = `<span>${U.esc(f.name)}</span><span class="docs-count">${count}</span>`;
    btn.onclick = () => { location.hash = "#/documents?folder=" + encodeURIComponent(f.id); };
    side.appendChild(btn);
    if (f.description) {
      const hint = U.el("p", "docs-folder-hint", U.esc(f.description));
      side.appendChild(hint);
    }
  });
  layout.appendChild(side);

  /* Doc cards */
  const main = U.el("div", "docs-main");
  let items = docs.items.filter((d) => d.published !== false);
  if (folderFilter) items = items.filter((d) => d.folderId === folderFilter);

  if (!items.length) {
    main.appendChild(U.el("p", "text-muted", "No documents in this folder yet."));
  } else {
    const grid = U.el("div", "docs-grid");
    items
      .slice()
      .sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")))
      .forEach((doc) => {
        const folder = docs.folders.find((f) => f.id === doc.folderId);
        const card = U.el("a", "docs-card reveal");
        card.href = "#/documents/" + encodeURIComponent(doc.id);
        card.appendChild(U.el("h3", "", U.esc(doc.title || "Untitled")));
        const meta = U.el("p", "docs-card-meta");
        meta.textContent = [folder ? folder.name : "Unfiled", doc.updated || ""].filter(Boolean).join(" · ");
        card.appendChild(meta);
        const snippet = (doc.body || "").replace(/[#>*`_\-\[\]()]/g, " ").trim().slice(0, 140);
        if (snippet) card.appendChild(U.el("p", "docs-card-snippet", U.esc(snippet) + (snippet.length >= 140 ? "…" : "")));
        grid.appendChild(card);
      });
    main.appendChild(grid);
  }
  layout.appendChild(main);
  frag.appendChild(layout);
  frag.appendChild(Shared.pageNav("documents"));

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}

function renderDocumentDetail(docId) {
  const app = document.getElementById("app");
  const docs = ensureDocs();
  const doc = docs.items.find((d) => d.id === docId);
  if (!doc || doc.published === false) {
    app.innerHTML = "";
    const wrap = U.el("div", "not-found");
    wrap.appendChild(U.el("h2", "", "Document not found"));
    const back = U.el("a", "cta-primary", "Back to Documents");
    back.href = "#/documents";
    wrap.appendChild(back);
    app.appendChild(wrap);
    return;
  }

  const frag = document.createDocumentFragment();
  const folder = docs.folders.find((f) => f.id === doc.folderId);
  const subtitle = [folder ? folder.name : "Unfiled", doc.updated ? "Updated " + doc.updated : ""]
    .filter(Boolean).join(" · ");

  frag.appendChild(Shared.pageHeader(doc.title || "Untitled", subtitle, "documents"));

  const article = U.el("article", "doc-article reveal");
  if (doc.format === "html") {
    article.innerHTML = doc.body || "";
  } else {
    article.innerHTML = renderMarkdown(doc.body || "");
  }
  frag.appendChild(article);
  frag.appendChild(Shared.pageNav("documents"));

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
}

function renderDocuments() {
  const hash = window.location.hash || "";
  const raw = hash.replace(/^#\/?/, "");
  const [pathPart, query = ""] = raw.split("?");
  const parts = pathPart.split("/").filter(Boolean);
  if (parts[0] === "documents" && parts[1]) {
    renderDocumentDetail(decodeURIComponent(parts[1]));
    return;
  }
  const folder = new URLSearchParams(query).get("folder") || "";
  renderDocumentsList(folder);
}
