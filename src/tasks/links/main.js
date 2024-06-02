import { exec } from 'gulp-execa'
import isCi from 'is-ci'

import { DOCKER_COMMAND } from './docker.js'
import { getExcludedFiles } from './exclude.js'
import { getIncludedFiles } from './include.js'
import { getExcludedLinks, getRemaps } from './urls.js'

// Detect dead links with lychee
export const links = async () => {
  await exec(
    [
      ...DOCKER_COMMAND,
      '--include-fragments',
      ...getFormatFlags(),
      ...getIncludedFiles(),
      ...getExcludedFiles(),
      ...getExcludedLinks(),
      ...getRemaps(),
    ].join(' '),
    { echo: false },
  )
}

const getFormatFlags = () =>
  isCi ? ['--verbose', '--format=detailed', '--no-progress'] : []
