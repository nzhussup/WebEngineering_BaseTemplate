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

## Task 3: Add static analysis and formatting

| Tool | Checks | Project example |
| --- | --- | --- |
| ESLint | Risky patterns and coding rules, including type-aware rules. | Reported the unhandled `initImages()` and `initBears()` promises. Startup now awaits both inside `try`/`catch`. |
| Prettier | Layout: indentation, quotes, semicolons, and line wrapping. | Wrapped the long request URL expression in `wikipedia.ts` using the required 80-column setting. It does not check whether requests work. |
| TypeScript | Type compatibility and possible missing/null values. | Caught `mark.textContent` being passed to `createTextNode()` as `string \| null`. `?? ''` now provides a string. |

These tools overlap, but serve different purposes. Formatting cannot detect a wrong type; type checking does not enforce all coding rules. None replaces runtime validation or browser checks. The Prettier ESLint preset avoids conflicting formatting rules. [Plugin documentation](https://github.com/prettier/eslint-plugin-prettier#configuration-legacy-eslintrc).

## Task 4: Provide a consistent command interface

npm scripts give developers and CI the same named commands. Neither needs to remember tool flags or paths. We can change the implementation while keeping names such as `build` and `lint` stable.

Commands compose through exit codes: `0` means success; non-zero means failure. `check` uses `&&` to run lint, formatting checks, and the build in order, stopping at the first failure. The build itself stops before bundling if TypeScript fails.

**Idempotence** means repeating an operation has the same effect as running it once. `format` and `lint:fix` should leave already-fixed files unchanged. `lint`, `format:check`, and `typecheck` do not modify source and should report the same result for unchanged input. With unchanged source and tools, `build` should regenerate equivalent output without accumulating stale files. `check` inherits those properties. `dev` and `preview` start long-running servers; starting a second instance is not an idempotent file operation.

## Task 5: Enforce quality before integration

A pre-commit hook gives fast feedback before a local commit. Husky connects Git to the hook; lint-staged selects staged source files and passes them to ESLint and Prettier. A failed check blocks the commit. Local hooks can be skipped or not installed, so they cannot enforce a shared standard alone. [Husky documentation](https://typicode.github.io/husky/how-to.html).

CI checks the pushed code in a fresh environment, installs dependencies with `npm ci`, and checks the whole project. This catches cross-file issues that a staged-file check might miss. Making the CI status required in branch protection prevents merging failed changes.

CI should report failures rather than rewrite source: the result must describe the submitted commit, not an automatically altered version. Developers fix problems locally and submit the corrections for review. Our workflow uses lint, formatting checks, and a build that checks types first. It generates `dist/` but leaves source unchanged.
