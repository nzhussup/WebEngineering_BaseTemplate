# Playground 2 — Theory answers

## Task 1: Establish the build

- **Source:** Files we edit: `index.html`, JavaScript in `src/`, CSS, and media.
- **Build:** The process that transforms source into files ready to serve: `npm run build`.
- **Distribution:** The generated result in `dist/`: HTML, bundled JavaScript, CSS, and assets. We regenerate it instead of editing it.
- **Deployment:** Publishing that distribution to a web host. Building or running a local preview does not deploy the site.

In development, Vite serves ES modules and updates the browser when files change, using hot updates where supported or a page reload. In production, it bundles and minifies code, processes assets, and writes the result to `dist/`. `npm run preview` serves that result locally for checking. [Vite documentation](https://vite.dev/guide/).

`package.json` declares dependencies; `package-lock.json` records the resolved dependency tree, exact versions, and integrity hashes, including indirect dependencies. This prevents different installs from silently choosing different dependency versions. `npm ci` installs from the lockfile and fails if it disagrees with `package.json`; it does not update the lockfile. Matching Node/npm versions also helps keep builds reproducible. [npm documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/).
