// @ts-check
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'

import packageJson from '../package.json' with { type: 'json' }

const execFile = promisify(execFileCallback)
const expectedRepository = 'Brandon-Ln/prettier-config'
const versionTag = `v${packageJson.version}`

/**
 * @param {string} message
 */
function fail(message) {
  throw new Error(`Release target validation failed: ${message}`)
}

if (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch') {
  fail('publish must be started with workflow_dispatch')
}

if (process.env.GITHUB_REPOSITORY !== expectedRepository) {
  fail(`expected repository ${expectedRepository}`)
}

if (process.env.GITHUB_REF !== 'refs/heads/main') {
  fail('publish must run from refs/heads/main')
}

await execFile('git', ['fetch', '--force', 'origin', 'main', '--tags'])

const [{ stdout: head }, { stdout: mainHead }, { stdout: tagHead }] =
  await Promise.all([
    execFile('git', ['rev-parse', 'HEAD']),
    execFile('git', ['rev-parse', 'origin/main']),
    execFile('git', ['rev-parse', versionTag]),
  ])

const commits = [head, mainHead, tagHead].map((value) => value.trim())

if (new Set(commits).size !== 1) {
  fail(`HEAD, origin/main, and ${versionTag} must point to the same commit`)
}

const packageUrl = `https://registry.npmjs.org/${encodeURIComponent(packageJson.name)}/${packageJson.version}`
const response = await fetch(packageUrl)

if (response.ok) {
  fail(`${packageJson.name}@${packageJson.version} already exists on npm`)
}

if (response.status !== 404) {
  fail(
    `npm registry returned ${response.status} while checking ${packageJson.version}`,
  )
}
