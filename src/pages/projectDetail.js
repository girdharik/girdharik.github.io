/* ── Project Detail Page ──────────────────────────── */

/* Track Chart.js instances for cleanup on re-render */
const _chartInstances = [];

/** Build a sortable/filterable table inside a container */
function _buildTableDOM(container, columns, rows, filterable) {
  if (filterable) {
    const filterBar = U.el("div", "table-filter-bar");
    const filterIcon = U.el("span", "table-filter-icon", U.icons.filter);
    const filterInput = document.createElement("input");
    filterInput.type = "text"; filterInput.placeholder = "Filter rows...";
    filterInput.className = "table-filter-input";
    filterInput.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      container.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
    filterBar.appendChild(filterIcon);
    filterBar.appendChild(filterInput);
    if (columns.length) {
      const colSelect = document.createElement("select");
      colSelect.className = "table-col-filter";
      colSelect.innerHTML = '<option value="all">All Columns</option>';
      columns.forEach((col, ci) => { colSelect.innerHTML += '<option value="' + ci + '">' + U.esc(col) + '</option>'; });
      colSelect.addEventListener("change", function () {
        const colIdx = this.value;
        const q = filterInput.value.toLowerCase();
        container.querySelectorAll("tbody tr").forEach(row => {
          if (colIdx === "all") { row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none"; }
          else { const cell = row.children[parseInt(colIdx)]; row.style.display = (cell && cell.textContent.toLowerCase().includes(q)) ? "" : "none"; }
        });
      });
      filterBar.appendChild(colSelect);
    }
    container.appendChild(filterBar);
  }

  const table = document.createElement("table");
  table.className = "data-table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  columns.forEach((col, ci) => {
    const th = document.createElement("th");
    th.textContent = col; th.style.cursor = "pointer"; th.dataset.sortDir = "none";
    th.addEventListener("click", () => {
      const dir = th.dataset.sortDir === "asc" ? "desc" : "asc";
      headerRow.querySelectorAll("th").forEach(h => { h.dataset.sortDir = "none"; h.classList.remove("sort-asc", "sort-desc"); });
      th.dataset.sortDir = dir; th.classList.add(dir === "asc" ? "sort-asc" : "sort-desc");
      const tbody = table.querySelector("tbody");
      const trs = Array.from(tbody.querySelectorAll("tr"));
      trs.sort((a, b) => {
        const aVal = a.children[ci].textContent, bVal = b.children[ci].textContent;
        const aNum = parseFloat(aVal.replace(/[^0-9.\-]/g, "")), bNum = parseFloat(bVal.replace(/[^0-9.\-]/g, ""));
        if (!isNaN(aNum) && !isNaN(bNum)) return dir === "asc" ? aNum - bNum : bNum - aNum;
        return dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
      trs.forEach(r => tbody.appendChild(r));
    });
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow); table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td"); td.textContent = cell;
      const lower = cell.toLowerCase();
      if (lower === "healthy") td.classList.add("status-healthy");
      else if (lower === "drifted" || lower === "critical") td.classList.add("status-drifted");
      else if (lower === "warning") td.classList.add("status-warning");
      else if (lower === "watch") td.classList.add("status-watch");
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const tableScroll = U.el("div", "table-scroll");
  tableScroll.appendChild(table);
  container.appendChild(tableScroll);
}

function renderProjectDetail(slug) {
  const app = document.getElementById("app");
  const project = SITE.projects.find((p) => p.slug === slug);

  /* Destroy previous Chart.js instances */
  _chartInstances.forEach((c) => c.destroy());
  _chartInstances.length = 0;

  if (!project || !project.detail) {
    app.innerHTML = '<div class="not-found"><h2>Project not found</h2><a href="#/projects">← Back to Projects</a></div>';
    return;
  }

  const frag = document.createDocumentFragment();
  const d = project.detail;

  /* Header */
  frag.appendChild(Shared.pageHeader(project.title, project.subtitle, "projects"));

  /* Tags */
  if (project.tags && project.tags.length) {
    const tagWrap = U.el("div", "detail-tags reveal");
    tagWrap.appendChild(Shared.tags(project.tags));
    frag.appendChild(tagWrap);
  }

  /* Render each detail section based on type */
  d.sections.forEach((sec) => {
    const block = Shared.sectionBlock(sec.title, "");
    block.classList.add("detail-block");

    switch (sec.type) {
      case "text":
        sec.content.forEach((p) => block.appendChild(U.el("p", "detail-text", U.esc(p))));
        break;

      case "metrics":
        block.appendChild(Shared.metricsGrid(sec.items, "detail-metrics"));
        break;

      case "features":
        block.appendChild(Shared.featureList(sec.items));
        break;

      case "tech":
        block.appendChild(Shared.techBadges(sec.items));
        break;

      case "timeline":
        const tl = U.el("div", "process-timeline");
        sec.steps.forEach((step, i) => {
          const item = U.el("div", "process-step");
          item.appendChild(U.el("div", "step-number", String(i + 1)));
          const body = U.el("div", "step-body");
          body.appendChild(U.el("h4", "", U.esc(step.title)));
          body.appendChild(U.el("p", "", U.esc(step.desc)));
          item.appendChild(body);
          tl.appendChild(item);
        });
        block.appendChild(tl);
        break;

      case "architecture":
        if (sec.image) {
          const img = document.createElement("img");
          img.src = sec.image; img.alt = sec.caption || "Architecture";
          img.className = "arch-img"; img.loading = "lazy";
          block.appendChild(img);
        }
        if (sec.caption) block.appendChild(U.el("p", "arch-caption", U.esc(sec.caption)));
        break;

      case "code":
        const pre = U.el("pre", "code-block");
        pre.appendChild(U.el("code", "", U.esc(sec.code)));
        block.appendChild(pre);
        break;

      case "gallery":
        const gallery = U.el("div", "gallery-grid");
        (sec.images || []).forEach((src) => {
          const img = document.createElement("img");
          img.src = src; img.className = "gallery-img"; img.loading = "lazy";
          gallery.appendChild(img);
        });
        block.appendChild(gallery);
        break;

      case "chart": {
        const chartWrap = U.el("div", "chart-container");

        /** Helper: finalize a chart with given data */
        const _makeChart = (canvas, chartData, sec) => {
          requestAnimationFrame(() => {
            const isDoughPieRadar = /doughnut|pie|radar/.test(sec.chartType);
            const defaultOpts = {
              responsive: true, maintainAspectRatio: true,
              plugins: { legend: { labels: { font: { family: "'IBM Plex Sans', sans-serif", size: 12 }, color: "#E8EEF6", usePointStyle: true, padding: 16 } } },
              scales: isDoughPieRadar ? undefined : {
                x: { ticks: { color: "#8B9BB0" }, grid: { color: "rgba(255,255,255,0.06)" } },
                y: { ticks: { color: "#8B9BB0" }, grid: { color: "rgba(255,255,255,0.06)" } },
              },
            };
            _chartInstances.push(new Chart(canvas, { type: sec.chartType || "bar", data: chartData, options: Object.assign({}, defaultOpts, sec.options || {}) }));
          });
        };

        if (sec.csvFile) {
          const loading = U.el("p", "detail-text", "Loading chart data…");
          chartWrap.appendChild(loading);
          block.appendChild(chartWrap);

          fetch(sec.csvFile)
            .then(res => { if (!res.ok) throw new Error("CSV not found"); return res.text(); })
            .then(text => {
              const parsed = U.parseCSV(text);
              if (!parsed.labels.length) { loading.textContent = "No data in CSV"; return; }
              chartWrap.removeChild(loading);

              const palette = ["#2EE6A8", "#5B8CFF", "#34d399", "#f59e0b", "#94a3b8", "#f87171", "#818cf8", "#fb923c"];
              const customColors = sec.colors || null;
              const chartData = { labels: parsed.labels, datasets: [] };

              parsed.series.forEach((s, i) => {
                const cfg = (sec.seriesConfig && sec.seriesConfig[i]) || {};
                const color = customColors ? (customColors[i] || palette[i % palette.length]) : palette[i % palette.length];
                const isRgba = /^rgba?\(/.test(color);
                const ds = { label: s.name, data: s.values, borderColor: color, backgroundColor: isRgba ? color : color + "33", tension: 0.35, ...cfg };

                /* Color thresholds: per-bar dynamic colors */
                if (cfg.colorThresholds) {
                  ds.backgroundColor = s.values.map(v => {
                    for (const t of cfg.colorThresholds) { if (t.above !== undefined && v > t.above) return t.color; }
                    return cfg.colorThresholds[cfg.colorThresholds.length - 1].color || color;
                  });
                  delete ds.colorThresholds;
                }

                if (sec.chartType === "bar" && !cfg.type) { ds.backgroundColor = ds.backgroundColor || (isRgba ? color : color + "B3"); ds.borderRadius = ds.borderRadius || 4; delete ds.tension; }
                if (/doughnut|pie/.test(sec.chartType)) { ds.backgroundColor = customColors || palette.slice(0, s.values.length); }
                if (sec.chartType === "line" && !cfg.type) { ds.fill = ds.fill !== undefined ? ds.fill : true; }
                chartData.datasets.push(ds);
              });

              const canvas = document.createElement("canvas");
              chartWrap.appendChild(canvas);
              _makeChart(canvas, chartData, sec);
            })
            .catch(err => { loading.textContent = "Could not load CSV: " + err.message; });
        } else {
          const canvas = document.createElement("canvas");
          chartWrap.appendChild(canvas);
          block.appendChild(chartWrap);
          const chartData = JSON.parse(JSON.stringify(sec.data));
          const origData = sec.data;
          chartData.datasets.forEach((ds, i) => {
            const orig = origData.datasets[i];
            if (typeof orig.backgroundColor === "function") {
              ds.backgroundColor = orig.data.map((val, idx) => orig.backgroundColor({ raw: val, dataIndex: idx }));
            }
          });
          _makeChart(canvas, chartData, sec);
        }
        break;
      }

      case "table": {
        const tableWrap = U.el("div", "table-section");

        if (sec.csvFile) {
          const loading = U.el("p", "detail-text", "Loading table data…");
          tableWrap.appendChild(loading);
          block.appendChild(tableWrap);
          fetch(sec.csvFile)
            .then(res => { if (!res.ok) throw new Error("CSV not found"); return res.text(); })
            .then(text => {
              const parsed = U.parseTableCSV(text);
              tableWrap.removeChild(loading);
              _buildTableDOM(tableWrap, parsed.columns, parsed.rows, sec.filterable);
            })
            .catch(err => { loading.textContent = "Could not load data: " + err.message; });
        } else {
          _buildTableDOM(tableWrap, sec.columns || [], sec.rows || [], sec.filterable);
          block.appendChild(tableWrap);
        }
        break;
      }

      default:
        break;
    }

    /* "files" section — notebooks, Python, SQL, CSV */
    if (sec.type === "files" && sec.items && sec.items.length) {
      const grid = U.el("div", "files-grid");
      sec.items.forEach(f => {
        const card = U.el("div", "file-card");
        card.style.cursor = "pointer";
        card.onclick = () => {
          const filePath = f.path || f.url;
          if (!filePath) { U.toast("File not available for preview"); return; }
          fetch(filePath)
            .then(res => { if (!res.ok) throw new Error("File not found"); return res.text(); })
            .then(content => U.showFileViewer(f.name, content))
            .catch(err => U.toast("Could not load: " + err.message));
        };
        const iconWrap = U.el("span", "file-icon", U.fileIcon(f.name));
        const info = U.el("div", "file-info");
        info.appendChild(U.el("span", "file-name", U.esc(f.name)));
        info.appendChild(U.el("span", "file-type", U.fileType(f.name)));
        if (f.description) info.appendChild(U.el("span", "file-desc", U.esc(f.description)));
        card.appendChild(iconWrap);
        card.appendChild(info);
        const eyeIcon = U.el("span", "file-ext-icon", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>');
        card.appendChild(eyeIcon);
        grid.appendChild(card);
      });
      block.appendChild(grid);
    }

    frag.appendChild(block);
  });

  /* Navigation to other projects */
  const navSec = U.el("div", "project-nav reveal");
  const idx = SITE.projects.indexOf(project);
  if (idx > 0) {
    const prev = SITE.projects[idx - 1];
    const a = U.el("a", "project-nav-link prev", "← " + U.esc(prev.title));
    a.href = "#/projects/" + prev.slug;
    navSec.appendChild(a);
  }
  if (idx < SITE.projects.length - 1) {
    const next = SITE.projects[idx + 1];
    const a = U.el("a", "project-nav-link next", U.esc(next.title) + " →");
    a.href = "#/projects/" + next.slug;
    navSec.appendChild(a);
  }
  frag.appendChild(navSec);

  app.innerHTML = "";
  app.appendChild(frag);
  U.observeReveal(app);
  window.scrollTo(0, 0);
}
