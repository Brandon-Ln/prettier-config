// @ts-check

/**
 * @typedef {import('bumpp').VersionBumpOptions} VersionBumpOptions
 */

/**
 * @type {VersionBumpOptions}
 */
const config = {
  all: true,
  commit: 'chore(release): v%s',
  confirm: true,
  execute: 'pnpm run release:prepare',
  noGitCheck: false,
  push: true,
  tag: 'v%s',
}

export default config
