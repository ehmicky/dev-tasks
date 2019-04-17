import { createWriteStream } from 'fs'

import fetch from 'cross-fetch'
import streamToPromise from 'stream-to-promise'

const CODECOV_DIST = `${__dirname}/../src/tasks/unit/codecov.sh`

// `codecov` upload script is in Bash and the repository does not have any
// `package.json` so we can't use `npm`.
// Using `curl` to retrieve it is slower in CI and randomly fails so we
// run this Gulp task instead anytime the script has a new version.
export const download = () => downloadFile(CODECOV_URL)

// eslint-disable-next-line fp/no-mutation
download.description = 'Download latest codecov upload script'

const CODECOV_URL = 'https://codecov.io/bash'

// Download a URL and save to filesystem.
// Done in streaming mode for best performance.
const downloadFile = async function(url, options) {
  const { body } = await fetch(CODECOV_URL, options)
  const stream = createWriteStream(CODECOV_DIST, options)
  const streamA = body.pipe(stream)
  await streamToPromise(streamA)
}
