# girdharik.github.io

Personal portfolio for **Girdhari Kumar** — Senior AI Engineer (GenAI & Multi-Agent Systems), with GCP Data Engineering as a secondary track.

**Live:** [https://girdharik.github.io](https://girdharik.github.io)

## Stack

Vanilla HTML / CSS / JS SPA (no build step). Chart.js for charts. Hash router. Hosted on GitHub Pages.

## Local preview

```bash
cd girdharik.github.io
python3 -m http.server 8080
# open http://localhost:8080
```

## Structure

```
index.html              Public site entry
admin.html              Browser content editor (commits via GitHub API)
certs/                  GCP certificate images + PDFs
data/                   CSV sample data for charts/tables
files/                  Previewable .py / .sql / .ipynb artifacts
src/
  data.js               All site content (single source of truth)
  router.js             Hash routing
  components/           Shared UI helpers
  pages/                Home, Experience, Projects, Skills, About
  styles/               Stylesheets
```

## Edit content

### Option A — Edit files in the repo

1. Change `src/data.js` (and CSS/JS under `src/` if needed).
2. Commit and push to `main`.
3. Wait for GitHub Pages to rebuild (~1 minute), then hard-refresh the live site.

### Option B — Use the admin page

1. Open [https://girdharik.github.io/admin.html](https://girdharik.github.io/admin.html).
2. Create a [GitHub Personal Access Token](https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Admin) with **repo** scope.
3. On the setup screen enter:
   - **Repo:** `girdharik/girdharik.github.io`
   - **Branch:** `main`
   - **Token:** paste the PAT (stored only in this browser’s `localStorage`)
4. Use **Documents** to write pages (Markdown/HTML), organize folders, and import `.md` / `.txt` / `.html` files. Live preview updates as you type.
5. Other tabs edit Personal, Home, Experience, Projects, Skills, About.
6. Click **Save & Publish** so changes commit to `src/data.js`. **Open live site** shows the published site (save first for latest text).

Experience tenure is computed from `start` / `end` dates — do not hard-code duration strings.

## Positioning

- **Primary:** AI / GenAI Engineer — LangGraph, Hybrid RAG, Vertex AI, FastAPI
- **Backup:** GCP Data Engineer — BigQuery, Dataproc, Airflow, cost guardrails
