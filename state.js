export const state = {
    status: "idle", // "idle" | "loading" | "ready" | "error"
    items: [],
    query: "",
    selectedId: null,
    errorMessage: "",
};

export function setStatus(nextStatus, errorMessage = "") {
    state.status = nextStatus;
    state.errorMessage = errorMessage;
}

export function setItems(items) {
    state.items = items;

    if (state.selectedId && items.some((item) => item.id === state.selectedId)) {
        return;
    }

    state.selectedId = items.length > 0 ? items[0].id : null;
}

export function setQuery(query) {
    state.query = query;

    const visibleItems = getVisibleItems();

    if (visibleItems.length === 0) {
        state.selectedId = null;
        return;
    }

    if (
        !state.selectedId ||
        !visibleItems.some((item) => item.id === state.selectedId)
    ) {
        state.selectedId = visibleItems[0].id;
    }
}

export function setSelectedId(id) {
    state.selectedId = id;
}

export function getVisibleItems() {
    const normalizedQuery = state.query.trim().toLowerCase();

    if (normalizedQuery === "") {
        return state.items;
    }

    return state.items.filter((item) =>
        item.title.toLowerCase().includes(normalizedQuery)
    );
}

export function getSelectedItem() {
    if (!state.selectedId) {
        return null;
    }

    return state.items.find((item) => item.id === state.selectedId) ?? null;
}