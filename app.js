/*
A5 starter app — intentionally NOT modules.

Everything is in this one file to help practice:
- identifying responsibilities
- splitting into modules
- keeping behavior unchanged
*/

const DATA_URL = "./data/items.json";

// -----------------------------
// State (single source of truth)
// -----------------------------

const state = {
  status: "idle", // "loading" | "error" | "ready"
  items: [],
  query: "",
  selectedId: null,
  errorMessage: "",
};

function setStatus(nextStatus, errorMessage = "") {
  state.status = nextStatus;
  state.errorMessage = errorMessage;
}

function setItems(items) {
  state.items = items;

  // Keep selection stable if possible.
  if (state.selectedId && items.some((it) => it.id === state.selectedId)) {
    return;
  }

  state.selectedId = items.length > 0 ? items[0].id : null;
}

function setQuery(query) {
  state.query = query;

  // If the current selection is filtered out, pick the first visible item.
  const visible = getVisibleItems(state);
  if (visible.length === 0) {
    state.selectedId = null;
    return;
  }

  if (!state.selectedId || !visible.some((it) => it.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }
}

function setSelectedId(id) {
  state.selectedId = id;
}

// -----------------------------
// Derived UI (selectors)
// -----------------------------

function getVisibleItems(state) {
  const q = state.query.trim().toLowerCase();
  if (q === "") return state.items;
  return state.items.filter((it) => it.title.toLowerCase().includes(q));
}

function getSelectedItem(state) {
  if (!state.selectedId) return null;
  return state.items.find((it) => it.id === state.selectedId) ?? null;
}

// -----------------------------
// DOM references
// -----------------------------

const el = {
  search: document.querySelector("#search"),
  status: document.querySelector("#status"),
  errorBox: document.querySelector("#error"),
  errorMessage: document.querySelector("#errorMessage"),
  retry: document.querySelector("#retry"),
  list: document.querySelector("#list"),
  detail: document.querySelector("#detail"),
};

// -----------------------------
// Rendering
// -----------------------------

function render() {
  renderStatus();
  renderError();
  renderList();
  renderDetail();
}

function renderStatus() {
  if (state.status === "loading") {
    el.status.textContent = "Loading…";
    return;
  }

  if (state.status === "error") {
    el.status.textContent = "";
    return;
  }

  const visibleCount = getVisibleItems(state).length;
  const totalCount = state.items.length;

  if (state.status === "ready") {
    if (totalCount === 0) {
      el.status.textContent = "No items loaded.";
      return;
    }

    if (visibleCount === 0) {
      el.status.textContent = "No matches.";
      return;
    }

    el.status.textContent = `${visibleCount} shown (${totalCount} total)`;
    return;
  }

  el.status.textContent = "";
}

function renderError() {
  const isError = state.status === "error";
  el.errorBox.hidden = !isError;
  if (!isError) return;

  el.errorMessage.textContent = state.errorMessage || "Something went wrong.";
}

function renderList() {
  el.list.replaceChildren();

  if (state.status !== "ready") {
    return;
  }

  const items = getVisibleItems(state);
  for (const item of items) {
    const li = document.createElement("li");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = item.id;
    btn.setAttribute("aria-current", item.id === state.selectedId ? "true" : "false");

    // Avoid innerHTML: render untrusted strings safely.
    btn.textContent = `${item.title} (${item.year})`;

    li.append(btn);
    el.list.append(li);
  }
}

function renderDetail() {
  el.detail.replaceChildren();

  if (state.status !== "ready") {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Details will appear when data is loaded.";
    el.detail.append(p);
    return;
  }

  const item = getSelectedItem(state);
  if (!item) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Select an item from the list.";
    el.detail.append(p);
    return;
  }

  const h3 = document.createElement("h3");
  h3.textContent = item.title;

  const meta = document.createElement("p");
  meta.className = "muted";
  meta.textContent = `${item.author} · ${item.year}`;

  const summary = document.createElement("p");
  summary.textContent = item.summary;

  const tags = document.createElement("p");
  tags.className = "muted";
  tags.textContent = `Tags: ${item.tags.join(", ")}`;

  el.detail.append(h3, meta, summary, tags);
}

// -----------------------------
// Data loading
// -----------------------------

async function loadItems() {
  setStatus("loading");
  render();

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while fetching ${DATA_URL}`);
    }

    const data = await response.json();

    // Minimal validation.
    if (!Array.isArray(data)) {
      throw new Error("Expected an array of items.");
    }

    const items = data
      .filter((it) => it && typeof it === "object")
      .map((it) => ({
        id: String(it.id ?? ""),
        title: String(it.title ?? ""),
        author: String(it.author ?? ""),
        year: Number(it.year ?? 0),
        tags: Array.isArray(it.tags) ? it.tags.map(String) : [],
        summary: String(it.summary ?? ""),
      }))
      .filter((it) => it.id && it.title);

    setItems(items);
    setStatus("ready");
    render();
  } catch (err) {
    console.error(err);
    setStatus("error", err instanceof Error ? err.message : String(err));
    render();
  }
}

// -----------------------------
// Event wiring
// -----------------------------

el.search.addEventListener("input", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;

  setQuery(target.value);
  render();
});

el.retry.addEventListener("click", () => {
  loadItems();
});

el.list.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const btn = target.closest("button[data-id]");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  if (!id) return;

  setSelectedId(id);
  render();
});

// Boot
loadItems();
