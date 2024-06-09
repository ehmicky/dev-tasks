import { cwd } from 'node:process'

import { LINKS_CACHE_FILE } from '../../files.js'

export const addInputPrefix = (filePath) => `${DOCKER_DIR}/${filePath}`

// Directory the current directory is mapped to inside the Docker container
export const DOCKER_DIR = '/input'

// Lychee is not available as a Node module, so we run it with Docker
export const DOCKER_COMMAND = [
  'docker',
  'run',
  '--init',
  `--volume=${cwd()}/${LINKS_CACHE_FILE}:/${LINKS_CACHE_FILE}`,
  `--volume=${cwd()}:${DOCKER_DIR}`,
  'lycheeverse/lychee',
]
