/* ── Ask-my-AI portfolio agent client ───────────── */

(function (global) {
  "use strict";

  /**
   * Existing Docker Space (girdharik/AiAgents) — new Docker Spaces are paid.
   * No trailing slash.
   */
  const AGENT_SPACE_URL = "https://girdharik-AiAgents.hf.space";

  /**
   * Shared key with Space secret PORTFOLIO_ASK_SECRET (same value).
   * Visible in Pages JS by design — raises the bar vs casual curl, not a vault.
   * Rotate both together if leaked widely.
   */
  const PORTFOLIO_ASK_KEY = "l_DA-AK80m_qN1_F53CHcyFxwBIeJnbN3I1ZsIfoiCI";

  const GENERIC_RETRY =
    "I couldn't complete that just now. Please try again in a moment.";

  const COMPARE_PROMPT =
    "If you’re hiring and want to see whether I’m a good fit, you’re welcome to " +
    "paste the job posting or requirements below, or upload a file " +
    "(PDF, Word, Markdown, or text). I’ll reply with a short, honest match.";

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
    "Reading the role…",
    "Comparing with my experience…",
    "Checking the main requirements…",
    "Writing a short summary…",
  ];

  const COMPARE_INTENT =
    /\b(good\s+fit|open\s+role|hiring|compare|match)\b.*\b(role|job|posting|position|opening|fit|experience)?\b|\bjob\s+(description|posting|req|requirements)\b|\bshare\s+(a\s+)?(jd|job)\b|\bif\s+i('m|\s+am)\s+a\s+(good\s+)?fit\b/i;

  const state = {
    ready: false,
    waking: false,
    asking: false,
    pendingQuestion: null,
    pendingJdText: null,
    pendingJdFile: null,
    attachedFile: null,
    awaitingJd: false,
    statusTimer: null,
    statusIdx: 0,
    statusLines: STATUS_LINES,
    /** Recent turns for follow-ups (“where is it used?”) — sent with /ask */
    history: [],
    /** Full JD text kept for match follow-ups (“why is Fit Partial?”) */
    lastJdText: "",
  };

  const MAX_HISTORY_TURNS = 6;

  function pushHistory(role, text) {
    const clean = String(text || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return;
    state.history.push({ role: role, text: clean.slice(0, 700) });
    if (state.history.length > MAX_HISTORY_TURNS) {
      state.history = state.history.slice(-MAX_HISTORY_TURNS);
    }
  }

  function historyForAsk() {
    // Exclude the current user turn (caller appends it after building payload)
    return state.history.slice();
  }

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

  function cleanAnswer(text) {
    return String(text || "")
      .replace(
        /^(?:\*{0,2})\s*(?:Answer|Examples|How it works|Safeguards|Stop)\.?\s*(?:\*{0,2})\s*:?\s*$/gim,
        ""
      )
      .replace(
        /^(?:\*{0,2})\s*(?:Answer|Examples)\s*(?:\*{0,2})\s*[—:-]\s*/gim,
        ""
      )
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function renderAssistant(markdown) {
    const cleaned = cleanAnswer(markdown);
    let html;
    try {
      html = global.marked ? global.marked.parse(cleaned || "") : null;
    } catch (_) {
      html = null;
    }
    if (html) {
      if (global.DOMPurify) {
        html = global.DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true },
        });
      }
      appendMessage("assistant", html, true);
    } else {
      appendMessage("assistant", cleaned || "", false);
    }
  }

  function askHeaders(extra) {
    const headers = Object.assign({}, extra || {});
    if (PORTFOLIO_ASK_KEY) {
      headers["X-Portfolio-Key"] = PORTFOLIO_ASK_KEY;
    }
    return headers;
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
    if (send) send.disabled = busy;
    document.querySelectorAll(".bot-jd-card-compare").forEach((btn) => {
      btn.disabled = busy;
    });
  }

  function clearAttachedFile() {
    state.attachedFile = null;
    const input = $("botJdFile");
    if (input) input.value = "";
    document.querySelectorAll(".bot-jd-chip").forEach((chip) => {
      chip.hidden = true;
      const name = chip.querySelector(".bot-jd-chip-name");
      if (name) name.textContent = "";
    });
  }

  function updateChipInCard(card) {
    if (!card) return;
    const chip = card.querySelector(".bot-jd-chip");
    const name = card.querySelector(".bot-jd-chip-name");
    if (!chip || !name) return;
    if (state.attachedFile) {
      name.textContent = state.attachedFile.name;
      chip.hidden = false;
    } else {
      name.textContent = "";
      chip.hidden = true;
    }
  }

  function removeJdCards() {
    document.querySelectorAll(".bot-msg-jd").forEach((el) => el.remove());
  }

  function showCompareCard() {
    removeJdCards();
    state.awaitingJd = true;
    clearAttachedFile();

    const thread = $("botMessages");
    if (!thread) return;

    const row = document.createElement("div");
    row.className = "bot-msg bot-msg-assistant bot-msg-jd";
    const bubble = document.createElement("div");
    bubble.className = "bot-bubble bot-jd-card";

    const prompt = document.createElement("p");
    prompt.className = "bot-jd-card-prompt";
    prompt.textContent = COMPARE_PROMPT;

    const chip = document.createElement("div");
    chip.className = "bot-jd-chip";
    chip.hidden = true;
    chip.innerHTML =
      '<span class="bot-jd-chip-name"></span>' +
      '<button type="button" class="bot-jd-chip-clear" aria-label="Remove file">&times;</button>';

    const ta = document.createElement("textarea");
    ta.className = "bot-jd-card-input";
    ta.rows = 4;
    ta.maxLength = 12000;
    ta.placeholder = "Paste the job posting or requirements here…";
    ta.setAttribute("aria-label", "Paste job posting or requirements");

    const actions = document.createElement("div");
    actions.className = "bot-jd-card-actions";

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "bot-jd-card-upload";
    uploadBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>' +
      " Upload file";

    const compareBtn = document.createElement("button");
    compareBtn.type = "button";
    compareBtn.className = "bot-jd-card-compare";
    compareBtn.textContent = "See if I’m a fit";

    actions.appendChild(uploadBtn);
    actions.appendChild(compareBtn);

    bubble.appendChild(prompt);
    bubble.appendChild(chip);
    bubble.appendChild(ta);
    bubble.appendChild(actions);
    row.appendChild(bubble);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;

    chip.querySelector(".bot-jd-chip-clear").addEventListener("click", () => {
      clearAttachedFile();
    });

    uploadBtn.addEventListener("click", () => {
      const fileInput = $("botJdFile");
      if (fileInput) fileInput.click();
    });

    compareBtn.addEventListener("click", () => {
      runJdMatch({ text: ta.value, file: state.attachedFile });
    });

    setTimeout(() => ta.focus(), 80);
  }

  function startCompareFlow(label) {
    const text = (label || "Looking for a good fit for an open role?").trim();
    state.lastJdText = "";
    appendMessage("user", text, false);
    showCompareCard();
    wakeAgent();
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
        headers: askHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          question: question,
          history: historyForAsk(),
        }),
      },
      ASK_TIMEOUT_MS
    );
    if (!res.ok) throw new Error("ask_failed_" + res.status);
    return res.json();
  }

  async function callMatchJd({ text, file, question }) {
    const hist = historyForAsk();
    const followup = (question || "").trim();
    let res;
    if (file) {
      const form = new FormData();
      form.append("file", file, file.name);
      if (text) form.append("jd", text);
      if (followup) form.append("question", followup);
      if (hist.length) form.append("history", JSON.stringify(hist));
      res = await fetchWithTimeout(
        AGENT_SPACE_URL + "/match_jd",
        {
          method: "POST",
          mode: "cors",
          headers: askHeaders(),
          body: form,
        },
        JD_TIMEOUT_MS
      );
    } else {
      const body = { jd: text || "" };
      if (followup) body.question = followup;
      if (hist.length) body.history = hist;
      res = await fetchWithTimeout(
        AGENT_SPACE_URL + "/match_jd",
        {
          method: "POST",
          mode: "cors",
          headers: askHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(body),
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

    if (COMPARE_INTENT.test(q)) {
      startCompareFlow(q);
      const input = $("botInput");
      if (input) input.value = "";
      return;
    }

    const input = $("botInput");
    if (input) input.value = "";

    appendMessage("user", q, false);
    // Prior turns only are sent with /ask or JD follow-up; append after reply.

    if (!spaceConfigured()) {
      renderAssistant(GENERIC_RETRY);
      return;
    }

    // After a JD match, route follow-ups to /match_jd with the cached posting.
    if (state.lastJdText && state.lastJdText.length >= 40) {
      await runJdFollowup(q);
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
      const answer = (data && data.answer) || GENERIC_RETRY;
      renderAssistant(answer);
      pushHistory("user", q);
      pushHistory("assistant", answer);
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

  async function runJdFollowup(question) {
    const q = (question || "").trim();
    if (!q || !state.lastJdText || state.asking) return;

    if (!state.ready) {
      state.pendingQuestion = q;
      setStatus(STATUS_LINES[0], true);
      if (!state.waking) wakeAgent();
      return;
    }

    setBusy(true);
    startStatusCycle(STATUS_LINES);

    try {
      let data;
      try {
        data = await callMatchJd({
          text: state.lastJdText,
          question: q,
        });
      } catch (_) {
        state.ready = false;
        await wakeAgent();
        data = await callMatchJd({
          text: state.lastJdText,
          question: q,
        });
      }
      stopStatusCycle();
      setStatus("", false);
      const answer = (data && data.answer) || GENERIC_RETRY;
      renderAssistant(answer);
      pushHistory("user", q);
      pushHistory("assistant", answer);
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
      renderAssistant(
        "Please paste a bit more of the posting, or upload the file, so I can compare fairly."
      );
      return;
    }

    removeJdCards();
    state.awaitingJd = false;

    const label = file
      ? "Shared posting: " + file.name
      : "Shared posting: " +
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
      const answer = (data && data.answer) || GENERIC_RETRY;
      renderAssistant(answer);
      // Cache JD for follow-ups (paste text, or server-echoed extract from file).
      const echoed = data && typeof data.jd === "string" ? data.jd : "";
      const cached = (jdText && jdText.length >= 40 ? jdText : echoed).slice(0, 12000);
      if (cached.length >= 40) state.lastJdText = cached;
      pushHistory("user", label);
      pushHistory("assistant", answer);
      clearAttachedFile();
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

  function hideGreeting(keepFabWave) {
    const el = $("botGreeting");
    const fab = $("botFab");
    if (fab && !keepFabWave) fab.classList.remove("bot-fab-wave");
    if (!el || (!el.classList.contains("is-visible") && !el.classList.contains("is-leaving"))) {
      return;
    }
    el.classList.remove("is-visible");
    el.classList.add("is-leaving");
    const finish = () => {
      el.classList.remove("is-leaving");
    };
    el.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 320);
  }

  function showGreeting() {
    const el = $("botGreeting");
    const fab = $("botFab");
    if (!el || !fab) return;
    // Panel already open — still flash the FAB wave once
    const panelOpen = fab.getAttribute("aria-expanded") === "true";

    fab.classList.remove("bot-fab-wave");
    void fab.offsetWidth;
    fab.classList.add("bot-fab-wave");
    setTimeout(() => fab.classList.remove("bot-fab-wave"), 3200);

    if (panelOpen) return;

    el.classList.remove("is-leaving");
    el.classList.remove("is-visible");
    // Force paint so the entrance animation restarts
    void el.offsetWidth;
    el.classList.add("is-visible");
  }

  function setOpen(open) {
    const fab = $("botFab");
    const panel = $("botPanel");
    if (!panel) return;
    if (fab) fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      hideGreeting(true);
      if (fab) fab.classList.remove("bot-fab-wave");
      panel.classList.remove("open");
      void panel.offsetWidth;
      panel.classList.add("open");
      wakeAgent();
      const input = $("botInput");
      if (input) setTimeout(() => input.focus(), 200);
    } else {
      panel.classList.remove("open");
      panel.classList.remove("is-resizing");
    }
  }

  function bindPanelResize(panel) {
    const handle = $("botPanelResize");
    if (!panel || !handle || handle.dataset.ready === "1") return;
    handle.dataset.ready = "1";

    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    function onMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Panel is right-anchored: drag left grows width, drag down grows height
      const nextW = Math.min(
        Math.max(startW + (startX - clientX), 300),
        Math.min(720, window.innerWidth - 24)
      );
      const nextH = Math.min(
        Math.max(startH + (clientY - startY), 320),
        window.innerHeight - 72
      );
      panel.style.width = nextW + "px";
      panel.style.height = nextH + "px";
      if (e.cancelable) e.preventDefault();
    }

    function onUp() {
      panel.classList.remove("is-resizing");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }

    function onDown(e) {
      if (!panel.classList.contains("open")) return;
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;
      panel.classList.add("is-resizing");
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
      e.preventDefault();
      e.stopPropagation();
    }

    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, { passive: false });
  }

  function initBot() {
    const fab = $("botFab");
    const panel = $("botPanel");
    const close = $("botClose");
    const form = $("botForm");
    if (!fab || !panel) return;

    // Avoid double-binding if initBot runs more than once
    if (fab.dataset.botReady === "1") {
      setTimeout(showGreeting, 600);
      return;
    }
    fab.dataset.botReady = "1";
    bindPanelResize(panel);

    fab.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    if (close) close.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideGreeting();
        setOpen(false);
      }
    });

    const greetOpen = $("botGreetingOpen");
    const greetDismiss = $("botGreetingDismiss");
    if (greetOpen) {
      greetOpen.addEventListener("click", () => setOpen(true));
    }
    if (greetDismiss) {
      greetDismiss.addEventListener("click", () => hideGreeting());
    }

    // Welcome bubble + hand wave shortly after first paint
    setTimeout(showGreeting, 700);

    panel.querySelectorAll(".bot-sample-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        setOpen(true);
        const action = btn.getAttribute("data-action") || "ask";
        const label = btn.textContent || "";
        if (action === "compare") {
          startCompareFlow(label);
        } else {
          sendQuestion(label);
        }
      });
    });

    const jdFile = $("botJdFile");
    const input = $("botInput");

    if (jdFile) {
      jdFile.addEventListener("change", () => {
        const file = jdFile.files && jdFile.files[0];
        if (!file) return;
        if (file.size > MAX_UPLOAD_BYTES) {
          jdFile.value = "";
          renderAssistant(
            "That file is too large (max 6 MB). Please paste the main requirements instead."
          );
          return;
        }
        state.attachedFile = file;
        const card = document.querySelector(".bot-jd-card");
        updateChipInCard(card);
        setStatus("File ready — tap Compare when you would like a short summary.", false);
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendQuestion(input ? input.value : "");
      });
    }

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendQuestion(input.value);
        }
      });
    }
  }

  global.initBot = initBot;
  global.AskMyAI = { wakeAgent, sendQuestion, AGENT_SPACE_URL };
})(window);
