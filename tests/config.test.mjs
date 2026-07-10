// @ts-check
import assert from 'node:assert/strict'
import test from 'node:test'

import prettier from 'prettier'

import config from '../index.js'

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
    jsxSingleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    bracketSpacing: true,
    bracketSameLine: false,
    proseWrap: 'preserve',
  })
})

test('formats JavaScript without semicolons and with single quotes', async () => {
  const output = await format(
    'const message = "hello"\nconst getUser = (id) => ({ id: id })',
    'example.js',
  )

  assert.equal(
    output,
    "const message = 'hello'\nconst getUser = (id) => ({ id: id })\n",
  )
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
