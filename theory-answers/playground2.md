# Playground 2 — Theory answers

## Task 1: Establish the build

- **Source:** Files we edit: `index.html`, JavaScript in `src/`, CSS, and media.
- **Build:** The process that transforms source into files ready to serve: `npm run build`.
- **Distribution:** The generated result in `dist/`: HTML, bundled JavaScript, CSS, and assets. We regenerate it instead of editing it.
- **Deployment:** Publishing that distribution to a web host. Building or running a local preview does not deploy the site.

In development, Vite serves ES modules and updates the browser when files change, using hot updates where supported or a page reload. In production, it bundles and minifies code, processes assets, and writes the result to `dist/`. `npm run preview` serves that result locally for checking. [Vite documentation](https://vite.dev/guide/).

`package.json` declares dependencies; `package-lock.json` records the resolved dependency tree, exact versions, and integrity hashes, including indirect dependencies. This prevents different installs from silently choosing different dependency versions. `npm ci` installs from the lockfile and fails if it disagrees with `package.json`; it does not update the lockfile. Matching Node/npm versions also helps keep builds reproducible. [npm documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

## Task 2: Migrate to TypeScript

**Structural typing:** Compatibility depends on an object's fields, not the name of its type. A function accepting `Bear` can receive any object with the required string fields: `name`, `binomial`, `fileName`, and `range`. It does not need to be created by a specific class.

**Type erasure:** Interfaces, annotations, and type-only imports disappear when TypeScript becomes JavaScript. Browsers execute JavaScript; they do not check our `Bear` interface. `readonly` also protects against assignment only during type checking.

API responses can change or contain errors. Declaring a response type, or writing `data as Bear`, does not validate its contents. We receive JSON as `unknown`, check object structure and field types, then use the narrowed values. For example:

```ts
const data: unknown = await response.json();
if (!isRecord(data)) {
  throw new Error('Wikipedia returned an invalid response.');
}
// data is now Record<string, unknown>; nested values still need checks.
```

The request layer validates wikitext and image URLs. The parser checks required species fields before constructing a `Bear`. Strict compilation catches code mistakes; runtime validation catches unexpected external data.
