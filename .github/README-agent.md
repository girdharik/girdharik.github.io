# Portfolio agent wiring

Backend repo: **`portfolio-qa-agent`** (standalone sibling of this site).

1. Deploy that repo as a Hugging Face **Docker** Space (see its `DEPLOY.md`).
2. Set `AGENT_SPACE_URL` in [`src/components/bot.js`](../src/components/bot.js) to `https://<user>-portfolio-qa.hf.space`.
3. Optional: GitHub secret `AGENT_SPACE_URL` for [wake-portfolio-agent.yml](workflows/wake-portfolio-agent.yml).

User-facing failures always show a generic retry line — never infra errors.
