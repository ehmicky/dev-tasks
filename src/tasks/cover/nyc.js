import { shouldCover } from './utils.js'

const NYCRC_CONFIG = `${__dirname}/.nycrc.json`

// Wrap with `nyc` if in CI
// Locally, one must directly call `nyc ava`
export const getNyc = function () {
  if (!shouldCover()) {
    return ''
  }

  return `nyc --nycrc-path=${NYCRC_CONFIG} `
}
