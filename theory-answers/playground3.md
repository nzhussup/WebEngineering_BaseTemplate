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
