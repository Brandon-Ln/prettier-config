# @brandlen/prettier-config

English | [简体中文](README.zh-CN.md)

A personal, shareable [Prettier](https://prettier.io/) configuration for Web projects.

It only uses Prettier 3 built-in language support, so it formats JavaScript, TypeScript, Vue SFCs, JSON, CSS, and Markdown without additional parsers or plugins.

## Installation

```bash
pnpm add -D prettier @brandlen/prettier-config
```

Reference the package from your project's `package.json`:

```json
{
  "prettier": "@brandlen/prettier-config",
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

For project-specific overrides, use an ESM config file:

```js
import base from '@brandlen/prettier-config'

/** @type {import('prettier').Config} */
export default {
  ...base,
  proseWrap: 'always',
}
```

## Formatting style

- Markdown preserves existing author line breaks; fenced code blocks still use their built-in parser.
- The package does not set `parser`; Prettier selects one from each file extension.

The shared config fixes `printWidth` at 100. `tabWidth`, `useTabs`, and `endOfLine` are intentionally left to each project's `.editorconfig`.

Generate both bundled templates in your project root:

```bash
npx @brandlen/prettier-config init
```

The command creates `.prettierignore` and `.editorconfig`, and leaves either file unchanged when it already exists.

## Ignored files

Prettier reads `.gitignore` and `.prettierignore` from the project root automatically. The template ignores package-manager lockfiles, dependencies, build output, caches, source maps, and minified files; append project-specific patterns as needed.

## Development and releases

Node 20.19 or later is required to run the Bumpp-powered release command. Before committing, run:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm install` installs a repository-local `commit-msg` hook. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/), such as `feat: add shared config`; pull requests receive the same validation in CI.

To release, start from an up-to-date, clean `main` branch and run:

```bash
pnpm release
```

The interactive command selects the SemVer version, rebuilds `CHANGELOG.md` from Conventional Commits, runs `pnpm verify`, creates one release commit and a `vX.Y.Z` tag, then pushes both. Do not run `npm publish` manually.
