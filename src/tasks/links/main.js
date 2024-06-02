import { exec } from 'gulp-execa'

import { DOCKER_COMMAND } from './docker.js'
import { getExcludedFiles } from './exclude.js'
import { getIncludedFiles } from './include.js'
import { getExcludedLinks, getRemaps } from './urls.js'

// Detect dead links with lychee
export const links = async () => {
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
  '--include-fragments',
  '--verbose',
  '--format=detailed',
  '--no-progress',
]
