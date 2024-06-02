import { GENERATED_SOURCES_DIR, DEPENDENCIES } from '../../files.js'

import { addInputPrefix } from './docker.js'

// Do not detect dead links in those files/directories
export const getExcludedFiles = () =>
  [DEPENDENCIES, GENERATED_SOURCES_DIR]
    .map(addInputPrefix)
    .map(addExcludePathFlag)

const addExcludePathFlag = (excludedPath) => `--exclude-path=${excludedPath}`
