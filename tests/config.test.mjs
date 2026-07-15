// @ts-check
import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { promisify } from 'node:util'

import prettier from 'prettier'

import config from '../index.js'

const execFile = promisify(execFileCallback)
const rootDirectory = fileURLToPath(new URL('..', import.meta.url))
const binPath = fileURLToPath(new URL('../bin.js', import.meta.url))

/**
 * @param {string} source
 * @param {string} filepath
 * @returns {Promise<string>}
 */
async function format(source, filepath) {
  return prettier.format(source, { ...config, filepath })
}

test('exports the expected personal style', () => {
  assert.deepEqual(config, {
    semi: false,
    singleQuote: true,
    printWidth: 100,
  })
})

test('formats JavaScript without semicolons and with single quotes', async () => {
  const output = await format(
    'const message = "hello"\nconst getUser = (id) => ({ id: id })',
    'example.js',
  )

  assert.equal(output, "const message = 'hello'\nconst getUser = (id) => ({ id: id })\n")
})

test('formats TypeScript using the inferred parser', async () => {
  const output = await format(
    'type User={name:string,roles:string[]}\nconst user:User={name:"Ada",roles:["admin","editor"]}',
    'example.ts',
  )

  assert.match(output, /type User = \{ name: string; roles: string\[\] \}/)
  assert.match(output, /name: 'Ada'/)
  assert.equal(output.endsWith(';\n'), false)
})

test('formats Vue single-file components using the inferred parser', async () => {
  const output = await format(
    '<script setup lang="ts">\nconst title="Hello"\n</script>\n<template><main><h1>{{title}}</h1></main></template>',
    'Example.vue',
  )

  assert.match(output, /const title = 'Hello'/)
  assert.match(output, /<template>/)
  assert.match(output, /\{\{ title \}\}/)
})

test('formats Markdown and embedded TypeScript without an extra plugin', async () => {
  const output = await format(
    '# Title\n\nA paragraph with **bold** text.\n\n```ts\nconst value={label:"ok"}\n```\n',
    'README.md',
  )

  assert.match(output, /const value = \{ label: 'ok' \}/)
  assert.match(output, /A paragraph with \*\*bold\*\* text\./)
})

test('initializes templates without overwriting existing files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'brandlen-prettier-config-'))

  try {
    const { stdout: initialOutput } = await execFile(process.execPath, [binPath, 'init'], {
      cwd: directory,
    })

    assert.match(initialOutput, /Created \.prettierignore/)
    assert.match(initialOutput, /Created \.editorconfig/)
    assert.equal(
      await readFile(join(directory, '.prettierignore'), 'utf8'),
      await readFile(join(rootDirectory, 'ignore'), 'utf8'),
    )
    assert.equal(
      await readFile(join(directory, '.editorconfig'), 'utf8'),
      await readFile(join(rootDirectory, 'editorconfig'), 'utf8'),
    )

    await writeFile(join(directory, '.editorconfig'), 'existing configuration\n')

    const { stdout: repeatedOutput } = await execFile(process.execPath, [binPath, 'init'], {
      cwd: directory,
    })

    assert.match(repeatedOutput, /Skipped existing files: \.prettierignore, \.editorconfig/)
    assert.equal(
      await readFile(join(directory, '.editorconfig'), 'utf8'),
      'existing configuration\n',
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
