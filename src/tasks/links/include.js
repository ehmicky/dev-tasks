import {
  SOURCES_DIRS,
  JAVASCRIPT_EXTS,
  TYPESCRIPT_EXT,
  JSON_YAML_EXTS,
  MARKDOWN_EXT,
} from '../../files.js'

import { addInputPrefix } from './docker.js'

// Detect dead links in those files
export const getIncludedFiles = () =>
  ['.', ...SOURCES_DIRS.map(addGlobStar)]
    .flatMap(addExtension)
    .map(addInputPrefix)

const addGlobStar = (sourceDir) => `${sourceDir}/**`

const addExtension = (sourceDir) =>
  extensionNames.map((extensionName) => `${sourceDir}/*.${extensionName}`)

const extensionNames = [
  ...JAVASCRIPT_EXTS,
  TYPESCRIPT_EXT,
  ...JSON_YAML_EXTS,
  MARKDOWN_EXT,
]
