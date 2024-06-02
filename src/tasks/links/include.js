import { SOURCES_DIRS, LINKS_EXTS } from '../../files.js'

import { addInputPrefix } from './docker.js'

// Detect dead links in those files
export const getIncludedFiles = () =>
  ['.', ...SOURCES_DIRS.map(addGlobStar)]
    .flatMap(addExtension)
    .map(addInputPrefix)

const addGlobStar = (sourceDir) => `${sourceDir}/**`

const addExtension = (sourceDir) =>
  LINKS_EXTS.map((extensionName) => `${sourceDir}/*.${extensionName}`)
