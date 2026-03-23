import { getSelectedItem, getVisibleItems } from "./state.js";

export function renderApp(elements, state) {
    renderStatus(elements, state);
    renderError(elements, state);
    renderList(elements, state);
    renderDetail(elements, state);
}

function renderStatus(elements, state) {
    if (state.status === "loading") {
        elements.status.textContent = "Loading…";
        return;
    }

    if (state.status === "error") {
        elements.status.textContent = "";
        return;
    }

    if (state.status !== "ready") {
        elements.status.textContent = "";
        return;
    }

    const visibleItems = getVisibleItems();
    const visibleCount = visibleItems.length;
    const totalCount = state.items.length;

    if (totalCount === 0) {
        elements.status.textContent = "No items loaded.";
    } else if (visibleCount === 0) {
        elements.status.textContent = "No matches.";
    } else {
        elements.status.textContent = `${visibleCount} shown (${totalCount} total)`;
    }
}

function renderError(elements, state) {
    const isError = state.status === "error";
    elements.errorBox.hidden = !isError;

    if (isError) {
        elements.errorMessage.textContent =
            state.errorMessage || "Something went wrong.";
    }
}

function renderList(elements, state) {
    elements.list.replaceChildren();

    if (state.status !== "ready") {
        return;
    }

    const visibleItems = getVisibleItems();

    for (const item of visibleItems) {
        const li = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.dataset.id = item.id;
        button.textContent = `${item.title} (${item.year})`;
        button.setAttribute(
            "aria-current",
            item.id === state.selectedId ? "true" : "false"
        );

        li.append(button);
        elements.list.append(li);
    }
}

function renderDetail(elements, state) {
    elements.detail.replaceChildren();

    if (state.status !== "ready") {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = "Details will appear when data is loaded.";
        elements.detail.append(p);
        return;
    }

    const selectedItem = getSelectedItem();

    if (!selectedItem) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = "Select an item from the list.";
        elements.detail.append(p);
        return;
    }

    const title = document.createElement("h3");
    title.textContent = selectedItem.title;

    const meta = document.createElement("p");
    meta.className = "muted";
    meta.textContent = `${selectedItem.author} · ${selectedItem.year}`;

    const summary = document.createElement("p");
    summary.textContent = selectedItem.summary;

    const tags = document.createElement("p");
    tags.className = "muted";
    tags.textContent = `Tags: ${selectedItem.tags.join(", ")}`;

    elements.detail.append(title, meta, summary, tags);
}