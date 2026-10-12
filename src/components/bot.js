/* ── Ask-my-AI portfolio agent client ───────────── */

(function (global) {
  "use strict";

  /**
   * Hugging Face Space base URL (no trailing slash).
   * Replace with your deployed Space, e.g. https://USER-portfolio-qa.hf.space
   */
  const AGENT_SPACE_URL = "https://REPLACE_HF_USER-portfolio-qa.hf.space";

  const WAKE_TIMEOUT_MS = 120000;
  const ASK_TIMEOUT_MS = 90000;
  const STATUS_LINES = [
    "Looking through my projects…",
    "Pulling the relevant details…",
    "Checking the architecture notes…",
    "Putting that together…",
  ];

  const state = {
    ready: false,
    waking: false,
    asking: false,
    pendingQuestion: null,
    statusTimer: null,
    statusIdx: 0,
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

  function startStatusCycle() {
    stopStatusCycle();
    state.statusIdx = 0;
    setStatus(STATUS_LINES[0], true);
    state.statusTimer = setInterval(() => {
      state.statusIdx = (state.statusIdx + 1) % STATUS_LINES.length;
      setStatus(STATUS_LINES[state.statusIdx], true);
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
    startStatusCycle();

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

    if (state.ready && state.pendingQuestion) {
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

  async function sendQuestion(question) {
    const q = (question || "").trim();
    if (!q || state.asking) return;

    const input = $("botInput");
    if (input) input.value = "";

    appendMessage("user", q, false);

    if (!spaceConfigured()) {
      renderAssistant(
        "The portfolio agent URL is not configured yet. Set `AGENT_SPACE_URL` in `src/components/bot.js` after deploying the Hugging Face Space."
      );
      return;
    }

    if (!state.ready) {
      state.pendingQuestion = q;
      setStatus(STATUS_LINES[0], true);
      if (!state.waking) wakeAgent();
      return;
    }

    state.asking = true;
    startStatusCycle();
    $("botSend") && ($("botSend").disabled = true);

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
      const answer = (data && data.answer) || "I couldn't find a good answer for that.";
      renderAssistant(answer);
    } catch (_) {
      stopStatusCycle();
      setStatus("", false);
      renderAssistant("Something went wrong answering that. Please try again in a moment.");
    } finally {
      state.asking = false;
      $("botSend") && ($("botSend").disabled = false);
      const thread = $("botMessages");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
  }

  function setOpen(open) {
    const fab = $("botFab");
    const panel = $("botPanel");
    if (!panel) return;
    if (fab) fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      // Restart pop/spin animation each open
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

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendQuestion(input ? input.value : "");
      });
    }
  }

  global.initBot = initBot;
  global.AskMyAI = { wakeAgent, sendQuestion, AGENT_SPACE_URL };
})(window);
