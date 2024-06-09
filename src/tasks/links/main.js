import { writeFile } from 'node:fs/promises'

import { exec } from 'gulp-execa'
import { pathExists } from 'path-exists'

import { LINKS_CACHE_FILE } from '../../files.js'

import { DOCKER_COMMAND } from './docker.js'
import { getExcludedFiles } from './exclude.js'
import { getIncludedFiles } from './include.js'
import { getExcludedLinks, getRemaps } from './urls.js'

// Detect dead links with lychee
export const links = async () => {
  if (!(await pathExists(LINKS_CACHE_FILE))) {
    await writeFile(LINKS_CACHE_FILE, '')
  }

  await exec(
    [
      ...DOCKER_COMMAND,
      ...MAIN_FLAGS,
      ...getIncludedFiles(),
      ...getExcludedFiles(),
      ...getExcludedLinks(),
      ...getRemaps(),
    ].join(' '),
    { echo: false },
  )
}

const MAIN_FLAGS = [
  '--cache',
  '--max-cache-age=1h',
  '--include-fragments',
  '--verbose',
  '--format=detailed',
  '--no-progress',
]
