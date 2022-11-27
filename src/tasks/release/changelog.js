#!/usr/bin/env node
import { execa } from 'execa'

// Generate the release notes automatically by reading the last entry in
// CHANGELOG.md
// Use `prettier` to remove line wrapping, since it looks odd in GitHub
// releases.
const runCli = async function () {
  await execa(
    `cat CHANGELOG.md \
      | tail -n+3 \
      | sed -n '/^# [0-9]/q; p' \
      | head -n-1 \
      | prettier --stdin-filepath=CHANGELOG.md --prose-wrap=never`,
    { shell: true, stdio: 'inherit' },
  )
}

runCli()
