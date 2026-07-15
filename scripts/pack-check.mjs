// @ts-check
import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)
const root = new URL('..', import.meta.url)
const rootPath = new URL('.', root).pathname
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'brandlen-prettier-config-'))

try {
  await execFile('pnpm', ['pack', '--pack-destination', temporaryDirectory], {
    cwd: rootPath,
  })

  const archive = (await readdir(temporaryDirectory)).find((file) => file.endsWith('.tgz'))
  assert.ok(archive, 'pnpm pack did not create a package archive')

  const fixtureDirectory = join(temporaryDirectory, 'fixture')
  await mkdir(fixtureDirectory)
  await writeFile(
    join(fixtureDirectory, 'package.json'),
    '{\n  "name": "pack-fixture",\n  "private": true\n}\n',
  )

  await execFile(
    'pnpm',
    [
      'add',
      '--ignore-scripts',
      '--config.auto-install-peers=false',
      '--save-dev',
      join(temporaryDirectory, archive),
    ],
    { cwd: fixtureDirectory },
  )

  await writeFile(
    join(fixtureDirectory, 'prettier.config.mjs'),
    "import config from '@brandlen/prettier-config'\n\nexport default config\n",
  )
  await writeFile(join(fixtureDirectory, 'example.ts'), 'const greeting="hello"\n')

  const prettierBin = join(rootPath, 'node_modules', 'prettier', 'bin', 'prettier.cjs')

  await execFile(process.execPath, [prettierBin, 'example.ts', '--write'], {
    cwd: fixtureDirectory,
  })
  await execFile(process.execPath, [prettierBin, 'example.ts', '--check'], {
    cwd: fixtureDirectory,
  })
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true })
}
