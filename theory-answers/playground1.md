# Playground 1 — Theory answers

## Task 1: Introduce ES modules

- **Scope:** Modules keep top-level variables private unless exported. Classic scripts share global scope: top-level `var` and functions become `window` properties; `let` and `const` do not.
- **Strict mode:** Modules enable it automatically; classic scripts need `"use strict"`. Assigning to an undeclared variable throws an error in strict mode. Top-level `this` is `undefined` in modules and `window` in classic browser scripts.
- **Loading:** A classic script blocks HTML parsing by default. Module scripts are deferred by default: they load their dependencies and run after HTML parsing. Dependencies execute first; each module URL is evaluated once.
- **Bindings:** Imports are live bindings: changes made by the exporting module are visible to importers. Importers cannot reassign the binding. For example, if a module exports `count` and a function increases it, importing code sees the updated `count`.

I separated search, comments, Wikipedia requests, and bear display. `main.js` starts the features; `bears.js` uses `wikipedia.js` for data. Request code stays separate from DOM updates, so API changes have a clear place. Each feature keeps its own variables, and imports make dependencies explicit. No module imports back up the chain, so there are no circular dependencies.
