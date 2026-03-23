## What my modules are

- main.js
- state.js
- render.js

## What each module owns/exports

- main.js  
  Entry point. It queries the DOM, wires events, fetches/parses the JSON data, and starts rendering. It does not export anything.

- state.js  
  Owns the single source of truth and selectors. Exports `state`, `setStatus`, `setItems`, `setQuery`, `setSelectedId`, `getVisibleItems`, and `getSelectedItem`.

- render.js  
  Owns DOM updates only. Exports `renderApp(elements, state)`.


# A5 Starter (No Modules)

This is a deliberately **single-file JavaScript** app intended as a starting point for A5.

- All JS lives in `app.js`
- It uses `fetch()` to load local JSON
- It includes explicit UI states: loading / error / empty / success

Your A5 task is to **refactor** this into ES modules (without changing behavior).

## How to run

From inside this folder:

```bash
python3 -m http.server 4040
```

Open:
- `http://localhost:4040/`

## What to refactor (suggested module split)

When you move to modules, a good split is:

- `src/state.js` — state object + selectors (derived values)
- `src/render.js` — DOM updates only
- `src/api.js` — fetch + parsing/validation only
- `src/dom.js` — DOM queries (exported refs)
- `src/main.js` — event wiring + boot

## Behavior checklist (should remain true after refactor)

- On load: shows loading, then shows the list
- Search filters the list
- Clicking an item shows details
- Error state shows a Retry button
