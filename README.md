# A5 Refactor into ES Modules

This project refactors the starter app into ES modules while keeping the same behavior.

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

## How to run

Open `index.html` with VS Code Live Server.

Open:
- http://127.0.0.1:5500/index.html

## What I tested after refactor

- On load, the app shows loading and then shows the list
- Search filters the list
- Clicking an item shows details
- Error state shows a Retry button
- The JSON still loads from `./data/items.json`
- The first item is selected automatically after load
- A search with no matches shows `No matches.`
- Retry attempts to load the data again

## Behavior checklist (should remain true after refactor)

- On load: shows loading, then shows the list
- Search filters the list
- Clicking an item shows details
- Error state shows a Retry button


## File Tree
.
├── data/
│   └── items.json
├── index.html
├── main.js
├── render.js
├── state.js
├── styles.css
└── README.md