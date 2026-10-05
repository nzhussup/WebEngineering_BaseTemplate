# Playground 3 — Theory answers

## Task 1: Establish the React application

**Imperative DOM code** describes steps: create an element, set its text, append it. **React's declarative model** describes the UI for the current props and state; React decides which DOM updates are needed.

- **Render:** React calls components to calculate the next UI. Rendering should be pure; it may run again without being committed.
- **Reconciliation:** React compares the new tree with the previous one, using element types, positions, and keys to determine what can be reused.
- **Commit:** React applies the required DOM changes and updates refs. Effects run after a commit; `useEffect` is where our temporary legacy integration starts.

External code should not change nodes React manages: React's stored tree could disagree with the real DOM, causing overwritten changes or failed updates. Our temporary `LegacyContent` component renders an empty host. React owns that host; the old code exclusively manages its children. All legacy queries are scoped to it. Later tasks replace this bridge with React components and state. React documents this empty-container exception for integrating imperative code. [DOM ownership and refs](https://react.dev/learn/manipulating-the-dom-with-refs).
