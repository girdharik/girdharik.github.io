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
  const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

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
    pendingJdText: null,
    pendingJdFile: null,
    attachedFile: null,
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

  function setBusy(busy) {
    state.asking = busy;
    const send = $("botSend");
    const match = $("botJdMatch");
    if (send) send.disabled = busy;
    if (match) match.disabled = busy;
  }

  function updateAttachChip() {
    const chip = $("botAttachChip");
    const name = $("botAttachName");
    if (!chip || !name) return;
    if (state.attachedFile) {
      name.textContent = state.attachedFile.name;
      chip.hidden = false;
    } else {
      name.textContent = "";
      chip.hidden = true;
    }
  }

  function clearAttachedFile() {
    state.attachedFile = null;
    const input = $("botJdFile");
    if (input) input.value = "";
    updateAttachChip();
  }

  function looksLikeJd(text) {
    const t = (text || "").trim();
    if (t.length < 280) return false;
    return /\b(responsibilit|requirement|qualifications?|must[- ]have|job description|years? of experience|we are (looking|seeking)|role overview)\b/i.test(
      t
    );
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
        setStatus("Still getting ready — try again in a moment.", false);
      }
    }

    if (state.ready && (state.pendingJdFile || state.pendingJdText)) {
      const file = state.pendingJdFile;
      const text = state.pendingJdText;
      state.pendingJdFile = null;
      state.pendingJdText = null;
      await runJdMatch({ file, text });
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
    if (!res.ok) throw new Error("ask_failed_" + res.status);
    return res.json();
  }

  async function callMatchJd({ text, file }) {
    let res;
    if (file) {
      const form = new FormData();
      form.append("file", file, file.name);
      if (text) form.append("jd", text);
      res = await fetchWithTimeout(
        AGENT_SPACE_URL + "/match_jd",
        { method: "POST", mode: "cors", body: form },
        JD_TIMEOUT_MS
      );
    } else {
      res = await fetchWithTimeout(
        AGENT_SPACE_URL + "/match_jd",
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jd: text || "" }),
        },
        JD_TIMEOUT_MS
      );
    }
    if (!res.ok) throw new Error("match_jd_failed_" + res.status);
    return res.json();
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
      state.pendingJdFile = null;
      state.pendingJdText = null;
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
      renderAssistant((data && data.answer) || GENERIC_RETRY);
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

  async function runJdMatch({ text, file }) {
    if (state.asking) return;
    const jdText = (text || "").trim();
    if (!file && jdText.length < 40) {
      appendMessage("user", "JD match", false);
      renderAssistant(
        "Paste a fuller job description, or attach a PDF / Word / Markdown file."
      );
      return;
    }

    const label = file
      ? "JD match: " + file.name
      : "JD match: " +
        (jdText.length > 140
          ? jdText.slice(0, 140).replace(/\s+/g, " ") + "…"
          : jdText.replace(/\s+/g, " "));
    appendMessage("user", label, false);

    if (!spaceConfigured()) {
      renderAssistant(GENERIC_RETRY);
      return;
    }

    if (!state.ready) {
      state.pendingJdFile = file || null;
      state.pendingJdText = jdText || null;
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
        data = await callMatchJd({ text: jdText, file: file || null });
      } catch (_) {
        state.ready = false;
        await wakeAgent();
        data = await callMatchJd({ text: jdText, file: file || null });
      }
      stopStatusCycle();
      setStatus("", false);
      renderAssistant((data && data.answer) || GENERIC_RETRY);
      clearAttachedFile();
      const input = $("botInput");
      if (input && file) {
        /* keep pasted text if any; clear only when file-driven */
      } else if (input) {
        input.value = "";
      }
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

  function submitMatch() {
    const input = $("botInput");
    const text = input ? input.value : "";
    runJdMatch({ text, file: state.attachedFile });
  }

  function submitAskOrMatch() {
    const input = $("botInput");
    const text = (input && input.value) || "";
    if (state.attachedFile) {
      submitMatch();
      return;
    }
    if (looksLikeJd(text)) {
      submitMatch();
      return;
    }
    sendQuestion(text);
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

    const jdFile = $("botJdFile");
    const jdMatch = $("botJdMatch");
    const clearBtn = $("botAttachClear");
    const input = $("botInput");

    if (clearBtn) {
      clearBtn.addEventListener("click", () => clearAttachedFile());
    }

    if (jdFile) {
      jdFile.addEventListener("change", () => {
        const file = jdFile.files && jdFile.files[0];
        if (!file) return;
        if (file.size > MAX_UPLOAD_BYTES) {
          jdFile.value = "";
          renderAssistant(
            "That file is too large (max 6 MB). Paste the requirements section instead."
          );
          return;
        }
        state.attachedFile = file;
        updateAttachChip();
        setStatus("JD attached — tap Match JD (or Ask will match automatically).", false);
      });
    }

    if (jdMatch) {
      jdMatch.addEventListener("click", () => {
        setOpen(true);
        submitMatch();
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitAskOrMatch();
      });
    }

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submitAskOrMatch();
        }
      });
    }
  }

  global.initBot = initBot;
  global.AskMyAI = { wakeAgent, sendQuestion, AGENT_SPACE_URL };
})(window);
