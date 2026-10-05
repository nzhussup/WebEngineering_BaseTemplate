# Playground 3 — Theory answers

## Task 1: Establish the React application

**Imperative DOM code** describes steps: create an element, set its text, append it. **React's declarative model** describes the UI for the current props and state; React decides which DOM updates are needed.

- **Render:** React calls components to calculate the next UI. Rendering should be pure; it may run again without being committed.
- **Reconciliation:** React compares the new tree with the previous one, using element types, positions, and keys to determine what can be reused.
- **Commit:** React applies the required DOM changes and updates refs. Effects run after a commit; `useEffect` is where our temporary legacy integration starts.

External code should not change nodes React manages: React's stored tree could disagree with the real DOM, causing overwritten changes or failed updates. Our temporary `LegacyContent` component renders an empty host. React owns that host; the old code exclusively manages its children. All legacy queries are scoped to it. Later tasks replace this bridge with React components and state. React documents this empty-container exception for integrating imperative code. [DOM ownership and refs](https://react.dev/learn/manipulating-the-dom-with-refs).

## Task 2: Design the component tree

A component boundary groups one responsibility: `SearchForm` submits a query, `CommentList` displays comments, and `BearCard` displays one bear. Typed props define their contracts: required data, allowed types, and callbacks. For example, `BearList` accepts a readonly bear array and a query; `SearchForm` receives `onSearch(query: string)`. Parents supply data, and children report actions through callbacks. Rendering calculates JSX without requests or DOM writes; requests happen in effects.

A **stable key** identifies the same item across renders. It must be unique among siblings and stay unchanged when the list moves. We use `bear.binomial`, which is the scientific name already used to deduplicate species. React uses keys during reconciliation to match old and new components and preserve their state and DOM nodes.

An array index identifies a position, not a bear. If the first bear is removed or the list is reordered, that position can represent another species. React may reuse the previous component's state for the wrong bear. Random keys are also unsuitable: they change every render and force remounts.

## Task 3: Model state and interaction

- **Props:** Inputs passed by a parent, such as `query` or `onAdd`. Children treat them as read-only.
- **Stored state:** Values React remembers between renders: comment drafts, the comment list, visibility, and the submitted search query.
- **Derived values:** Calculated from current props/state. `nameMissing` comes from `name.trim() === ''`; the toggle label comes from `visible`. Storing these separately would create values that could disagree.

Controlled inputs use `value` from state and `onChange` to update it. Successful submission clears state, which clears the inputs. The search draft and applied query are intentionally different: editing the draft does not apply a search until submission.

Direct mutation changes an existing object without giving React a new reference. React may skip an update, and previous state snapshots can be changed unexpectedly. We append comments with `setComments(previous => [...previous, comment])`. The new array preserves old state; the functional update uses the latest pending value.

Lift state to the nearest ancestor shared by its consumers. `App` owns the applied query because navigation submits it and the article uses it. Comment state stays in `CommentsSection`; input drafts stay in their forms. Props are clear over these short paths. Context is useful when many distant components need the same value; it would add unnecessary indirection here.

## Task 4: Load and represent remote data

Rendering calculates UI from props and state. Fetching contacts an external system, takes time, and can fail. Starting requests during render would make rendering impure and could send duplicate requests when React renders again. `useEffect` starts this synchronization after a commit.

Our `useBears` hook stores a discriminated union: `loading`, `success`, `empty`, or `error`. Only success contains bears; only error contains a message. A valid table without rows is empty. A failed request or unrecognised page format is an error, not an empty result.

Requests can finish out of order: request A starts, the user reloads, request B finishes, then A finishes. Without protection, A could replace B's newer result. Reload and effect cleanup abort the old requests. An active-effect check also rejects late results if cancellation is ignored or the response has already arrived. Cleanup runs before the next effect and on unmount.

Image checks use the same cleanup pattern. Aborting removes listeners and timers; missing or failed images show a placeholder without discarding valid bear data. Errors from cancelled work are ignored because that work no longer belongs to the current UI.

## Task 5: Add client-side routing and verify the migration

**Client-side rendering** means JavaScript in the browser creates and updates the UI. The server sends the app shell and JS bundle; React renders the components.

An **SPA** is a client-rendered app that keeps one HTML document open. Navigation updates the visible view instead of loading a new document for every page.

**Client-side routing** maps the URL to React components inside that SPA. Here, `#/bears` renders the list page and `#/bears/:bearId` renders one bear detail page. `HashRouter` keeps refresh/direct links working in the static Vite build.

Route parameters are required parts of the path. `:bearId` identifies the selected bear, so `#/bears/u-arctos` means "open this bear." Query parameters are optional view state. `?q=brown` means "same page, with this search applied." Query params can be added, removed, or reordered without changing the main resource.

Benefit: navigation feels fast and URLs are shareable, including a selected bear and search query. Cost: more logic runs in the browser. The first useful view depends on loading JS and data, and normal path routing would need server fallback config; that is why this project uses hash routing.
