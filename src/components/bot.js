/* ── Ask-my-AI portfolio agent client ───────────── */

(function (global) {
  "use strict";

  /**
   * Existing Docker Space (girdharik/AiAgents) — new Docker Spaces are paid.
   * No trailing slash.
   */
  const AGENT_SPACE_URL = "https://girdharik-AiAgents.hf.space";

  const GENERIC_RETRY =
    "I couldn't complete that just now. Please try again in a moment.";

  const WAKE_TIMEOUT_MS = 120000;
  const ASK_TIMEOUT_MS = 90000;
  const JD_TIMEOUT_MS = 120000;
  const MAX_JD_CHARS = 12000;

  const STATUS_LINES = [
    "Looking through my projects…",
    "Pulling the relevant details…",
    "Checking the architecture notes…",
    "Putting that together…",
  ];

  const JD_STATUS_LINES = [
    "Reading the job description…",
    "Comparing against my experience…",
    "Checking must-have requirements…",
    "Writing a short fit summary…",
  ];

  const state = {
    ready: false,
    waking: false,
    asking: false,
    pendingQuestion: null,
    pendingJd: null,
    statusTimer: null,
    statusIdx: 0,
    statusLines: STATUS_LINES,
  };

  function spaceConfigured() {
    return AGENT_SPACE_URL && !AGENT_SPACE_URL.includes("REPLACE_HF_USER");
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(text, busy) {
    const el = $("botStatus");
    if (!el) return;
    el.textContent = text || "";
    el.hidden = !text;
    el.classList.toggle("busy", !!busy);
  }

  function startStatusCycle(lines) {
    stopStatusCycle();
    state.statusLines = lines && lines.length ? lines : STATUS_LINES;
    state.statusIdx = 0;
    setStatus(state.statusLines[0], true);
    state.statusTimer = setInterval(() => {
      state.statusIdx = (state.statusIdx + 1) % state.statusLines.length;
      setStatus(state.statusLines[state.statusIdx], true);
    }, 2800);
  }

  function stopStatusCycle() {
    if (state.statusTimer) {
      clearInterval(state.statusTimer);
      state.statusTimer = null;
    }
  }

  function appendMessage(role, htmlOrText, isHtml) {
    const thread = $("botMessages");
    if (!thread) return null;
    const row = document.createElement("div");
    row.className = "bot-msg bot-msg-" + role;
    const bubble = document.createElement("div");
    bubble.className = "bot-bubble";
    if (isHtml) {
      bubble.innerHTML = htmlOrText;
    } else {
      bubble.textContent = htmlOrText;
    }
    row.appendChild(bubble);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row;
  }

  function renderAssistant(markdown) {
    let html;
    try {
      html = global.marked ? global.marked.parse(markdown || "") : null;
    } catch (_) {
      html = null;
    }
    if (html) {
      appendMessage("assistant", html, true);
    } else {
      appendMessage("assistant", markdown || "", false);
    }
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
      clearTimeout(t);
    }
  }

  async function wakeAgent() {
    if (!spaceConfigured()) {
      state.ready = false;
      return false;
    }
    if (state.ready || state.waking) return state.ready;
    state.waking = true;
    startStatusCycle(STATUS_LINES);

    const started = Date.now();
    let delay = 1500;
    try {
      while (Date.now() - started < WAKE_TIMEOUT_MS) {
        try {
          const res = await fetchWithTimeout(
            AGENT_SPACE_URL + "/health",
            { method: "GET", mode: "cors", cache: "no-store" },
            15000
          );
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (!data.status || data.status === "ok" || data.ready) {
              state.ready = true;
              break;
            }
          }
        } catch (_) {
          /* keep retrying through cold start */
        }
        await new Promise((r) => setTimeout(r, delay));
        delay = Math.min(delay + 1000, 6000);
      }
    } finally {
      state.waking = false;
      stopStatusCycle();
      if (state.ready) {
        setStatus("", false);
      } else {
        setStatus("Still getting ready — try your question again in a moment.", false);
      }
    }

    if (state.ready && state.pendingJd) {
      const jd = state.pendingJd;
      state.pendingJd = null;
      await sendJdMatch(jd);
    } else if (state.ready && state.pendingQuestion) {
      const q = state.pendingQuestion;
      state.pendingQuestion = null;
      await sendQuestion(q);
    }
    return state.ready;
  }

  async function callAsk(question) {
    const res = await fetchWithTimeout(
      AGENT_SPACE_URL + "/ask",
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      },
      ASK_TIMEOUT_MS
    );
    if (!res.ok) {
      throw new Error("ask_failed_" + res.status);
    }
    return res.json();
  }

  async function callMatchJd(jd) {
    const res = await fetchWithTimeout(
      AGENT_SPACE_URL + "/match_jd",
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      },
      JD_TIMEOUT_MS
    );
    if (!res.ok) {
      throw new Error("match_jd_failed_" + res.status);
    }
    return res.json();
  }

  function setBusy(busy) {
    state.asking = busy;
    const send = $("botSend");
    const match = $("botJdMatch");
    if (send) send.disabled = busy;
    if (match) match.disabled = busy;
  }

  async function sendQuestion(question) {
    const q = (question || "").trim();
    if (!q || state.asking) return;

    const input = $("botInput");
    if (input) input.value = "";

    appendMessage("user", q, false);

    if (!spaceConfigured()) {
      renderAssistant(GENERIC_RETRY);
      return;
    }

    if (!state.ready) {
      state.pendingQuestion = q;
      state.pendingJd = null;
      setStatus(STATUS_LINES[0], true);
      if (!state.waking) wakeAgent();
      return;
    }

    setBusy(true);
    startStatusCycle(STATUS_LINES);

    try {
      let data;
      try {
        data = await callAsk(q);
      } catch (_) {
        state.ready = false;
        await wakeAgent();
        data = await callAsk(q);
      }

      stopStatusCycle();
      setStatus("", false);
      const answer = (data && data.answer) || GENERIC_RETRY;
      renderAssistant(answer);
    } catch (_) {
      stopStatusCycle();
      setStatus("", false);
      renderAssistant(GENERIC_RETRY);
    } finally {
      setBusy(false);
      const thread = $("botMessages");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
  }

  async function sendJdMatch(jdText) {
    const jd = (jdText || "").trim();
    if (!jd || state.asking) return;

    if (jd.length < 40) {
      appendMessage("user", "JD match (too short)", false);
      renderAssistant(
        "Paste a fuller job description (role summary + requirements) so I can compare fairly."
      );
      return;
    }

    const preview =
      jd.length > 160 ? jd.slice(0, 160).replace(/\s+/g, " ") + "…" : jd.replace(/\s+/g, " ");
    appendMessage("user", "JD match: " + preview, false);

    if (!spaceConfigured()) {
      renderAssistant(GENERIC_RETRY);
      return;
    }

    if (!state.ready) {
      state.pendingJd = jd;
      state.pendingQuestion = null;
      setStatus(JD_STATUS_LINES[0], true);
      if (!state.waking) wakeAgent();
      return;
    }

    setBusy(true);
    startStatusCycle(JD_STATUS_LINES);

    try {
      let data;
      try {
        data = await callMatchJd(jd);
      } catch (_) {
        state.ready = false;
        await wakeAgent();
        data = await callMatchJd(jd);
      }

      stopStatusCycle();
      setStatus("", false);
      const answer = (data && data.answer) || GENERIC_RETRY;
      renderAssistant(answer);
    } catch (_) {
      stopStatusCycle();
      setStatus("", false);
      renderAssistant(GENERIC_RETRY);
    } finally {
      setBusy(false);
      const thread = $("botMessages");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
  }

  function setJdOpen(open) {
    const toggle = $("botJdToggle");
    const panel = $("botJdPanel");
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
  }

  function readJdFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("no_file"));
        return;
      }
      const name = (file.name || "").toLowerCase();
      const okExt = /\.(txt|md|text)$/.test(name) || (file.type || "").startsWith("text/");
      if (!okExt) {
        reject(new Error("bad_type"));
        return;
      }
      if (file.size > MAX_JD_CHARS * 2) {
        reject(new Error("too_large"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "").slice(0, MAX_JD_CHARS);
        resolve(text);
      };
      reader.onerror = () => reject(new Error("read_failed"));
      reader.readAsText(file);
    });
  }

  function setOpen(open) {
    const fab = $("botFab");
    const panel = $("botPanel");
    if (!panel) return;
    if (fab) fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      panel.classList.remove("open");
      void panel.offsetWidth;
      panel.classList.add("open");
      wakeAgent();
      const input = $("botInput");
      if (input) setTimeout(() => input.focus(), 200);
    } else {
      panel.classList.remove("open");
    }
  }

  function initBot() {
    const fab = $("botFab");
    const panel = $("botPanel");
    const close = $("botClose");
    const form = $("botForm");
    const input = $("botInput");
    if (!fab || !panel) return;

    fab.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    if (close) close.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    panel.querySelectorAll(".bot-sample-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        setOpen(true);
        sendQuestion(btn.textContent || "");
      });
    });

    const jdToggle = $("botJdToggle");
    const jdMatch = $("botJdMatch");
    const jdInput = $("botJdInput");
    const jdFile = $("botJdFile");

    if (jdToggle) {
      jdToggle.addEventListener("click", () => {
        const open = jdToggle.getAttribute("aria-expanded") !== "true";
        setJdOpen(open);
        if (open && jdInput) setTimeout(() => jdInput.focus(), 100);
      });
    }

    if (jdMatch) {
      jdMatch.addEventListener("click", () => {
        setOpen(true);
        sendJdMatch(jdInput ? jdInput.value : "");
      });
    }

    if (jdFile) {
      jdFile.addEventListener("change", async () => {
        const file = jdFile.files && jdFile.files[0];
        jdFile.value = "";
        if (!file) return;
        try {
          const text = await readJdFile(file);
          if (jdInput) jdInput.value = text;
          setJdOpen(true);
          setStatus("JD loaded — tap Check fit when ready.", false);
        } catch (err) {
          const code = err && err.message;
          if (code === "bad_type") {
            renderAssistant("Please upload a plain .txt or .md job description.");
          } else if (code === "too_large") {
            renderAssistant("That file is too large. Paste the requirements section instead.");
          } else {
            renderAssistant(GENERIC_RETRY);
          }
        }
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendQuestion(input ? input.value : "");
      });
    }
  }

  global.initBot = initBot;
  global.AskMyAI = { wakeAgent, sendQuestion, sendJdMatch, AGENT_SPACE_URL };
})(window);
