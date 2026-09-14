# Playground 1 — Theory answers

## Task 1: Introduce ES modules

- **Scope:** Modules keep top-level variables private unless exported. Classic scripts share global scope: top-level `var` and functions become `window` properties; `let` and `const` do not.
- **Strict mode:** Modules enable it automatically; classic scripts need `"use strict"`. Assigning to an undeclared variable throws an error in strict mode. Top-level `this` is `undefined` in modules and `window` in classic browser scripts.
- **Loading:** A classic script blocks HTML parsing by default. Module scripts are deferred by default: they load their dependencies and run after HTML parsing. Dependencies execute first; each module URL is evaluated once.
- **Bindings:** Imports are live bindings: changes made by the exporting module are visible to importers. Importers cannot reassign the binding. For example, if a module exports `count` and a function increases it, importing code sees the updated `count`.

I separated search, comments, Wikipedia requests, and bear display. `main.js` starts the features; `bears.js` uses `wikipedia.js` for data. Request code stays separate from DOM updates, so API changes have a clear place. Each feature keeps its own variables, and imports make dependencies explicit. No module imports back up the chain, so there are no circular dependencies.

## Task 2: Correct the application behavior

An event travels through three phases:

1. **Capturing:** From `window` down through the target's ancestors. Listen here with `addEventListener(type, handler, { capture: true })`.
2. **Target:** The event reaches the element where it started, such as the comment button.
3. **Bubbling:** If the event bubbles, it travels back up through the ancestors. Listeners use this phase by default.

`event.target` is where the event started; `event.currentTarget` is the element whose listener is running. `preventDefault()` cancels the default action, such as a form navigating away. It does not stop propagation; `stopPropagation()` does.

Delegation could handle future delete buttons in `.comment-container`: one listener on the list checks `event.target.closest('.delete-comment')`. It also handles buttons added with new comments. The trade-off is extra target filtering and dependence on bubbling; a child that stops propagation can prevent the handler from running. Direct listeners are simpler for the current fixed forms and toggle.
