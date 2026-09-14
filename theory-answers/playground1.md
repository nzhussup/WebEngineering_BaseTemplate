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

## Task 3: Make failures explicit

Synchronous exceptions move up the call stack until a `catch` handles them. For example, `extractBears()` throws when a species row is incomplete; `initBears()` catches it and shows a load error.

Network failures and invalid JSON reject promises. Throwing inside `.then()` also rejects the next promise. Rejections travel through returned promise chains; `await` turns a rejection into a throw at that line, where `try`/`catch` can handle it. A plain `try` around an unawaited promise cannot catch its later rejection.

`fetch()` does not reject for HTTP errors such as 404 or 503, so `requestWikipedia()` checks `response.ok`. Image `error` events are separate callbacks; `loadImage()` converts them into promise rejections.

Catch where recovery is possible: `initBears()` shows a list error; `loadBearImage()` restores one placeholder and lets later images load. Low-level request helpers keep errors rejected. Returning `[]` or `null` for every failure would hide its cause and look like valid missing data. Console logging preserves technical details; the page shows a readable message. `null` is reserved for an explicitly missing Wikipedia file.

## Task 4: Refactor asynchronous control flow

An `async` function always returns a promise. `await` pauses that function until a promise settles; it does not block the browser. A rejection throws at the `await`, so `try`/`catch` still works.

The event loop runs tasks such as clicks and timers. After the current stack finishes, it drains microtasks, including promise handlers and continuations after `await`, before taking another task. Rendering can happen between tasks. Even awaiting an already resolved promise resumes asynchronously:

```js
async function example() {
  console.log('A');
  await Promise.resolve();
  console.log('C');
}
example();
console.log('B'); // A, B, C
```

`bears.map(...)` starts independent image operations; `Promise.all()` waits for them together and keeps results in input order. Each card already exists, so completion order cannot reorder bears. Each image handles its own failure. Normally, `Promise.all()` rejects when one input rejects, without cancelling the others. Concurrency overlaps waiting; it does not make JavaScript callbacks run on separate threads.

Arrow functions inherit `this` from their surrounding scope; regular functions receive `this` according to how they are called. In a regular DOM event listener, `this` is the listener's element. An arrow listener must use an explicit reference or `event.currentTarget` instead. Our callbacks use explicit references, so conversion is safe. Arrows also have no own `arguments` and cannot be called with `new`.
