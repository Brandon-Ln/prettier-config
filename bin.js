#!/usr/bin/env node
// @ts-check

import { access, copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const templates = [
  { source: 'ignore', target: '.prettierignore' },
  { source: 'editorconfig', target: '.editorconfig' },
]

const packageDirectory = fileURLToPath(new URL('.', import.meta.url))

function printUsage() {
  console.log('Usage: prettier-config init')
}

async function initialize() {
  const skipped = []

  for (const template of templates) {
    const source = join(packageDirectory, template.source)
    const target = join(process.cwd(), template.target)

    try {
      await access(target)
      skipped.push(template.target)
    } catch {
      await copyFile(source, target)
      console.log(`Created ${template.target}`)
    }
  }

  if (skipped.length > 0) {
    console.log(`Skipped existing files: ${skipped.join(', ')}`)
  }
}

const [command] = process.argv.slice(2)

if (command === 'init') {
  await initialize()
} else {
  printUsage()
  process.exitCode = command ? 1 : 0
}
