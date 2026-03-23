import { renderApp } from "./render.js";
import {
    state,
    setItems,
    setQuery,
    setSelectedId,
    setStatus,
} from "./state.js";

const DATA_URL = "./data/items.json";

const elements = {
    search: document.querySelector("#search"),
    status: document.querySelector("#status"),
    errorBox: document.querySelector("#error"),
    errorMessage: document.querySelector("#errorMessage"),
    retry: document.querySelector("#retry"),
    list: document.querySelector("#list"),
    detail: document.querySelector("#detail"),
};

function render() {
    renderApp(elements, state);
}

async function fetchItems(dataUrl = DATA_URL) {
    const response = await fetch(dataUrl, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching ${dataUrl}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Expected items.json to contain an array.");
    }

    return data
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
            id: String(item.id ?? ""),
            title: String(item.title ?? ""),
            author: String(item.author ?? ""),
            year: Number(item.year ?? 0),
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
            summary: String(item.summary ?? ""),
        }))
        .filter((item) => item.id && item.title);
}

async function loadItems() {
    setStatus("loading");
    render();

    try {
        const items = await fetchItems();
        setItems(items);
        setStatus("ready");
    } catch (error) {
        console.error(error);
        setStatus("error", error instanceof Error ? error.message : String(error));
    }

    render();
}

elements.search.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
        return;
    }

    setQuery(target.value);
    render();
});

elements.retry.addEventListener("click", () => {
    loadItems();
});

elements.list.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    const button = target.closest("button[data-id]");
    if (!button) {
        return;
    }

    const id = button.getAttribute("data-id");
    if (!id) {
        return;
    }

    setSelectedId(id);
    render();
});

loadItems();