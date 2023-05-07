import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

import { got } from 'got'

const CODECOV_DIST = new URL('../src/tasks/cover/codecov.sh', import.meta.url)
const CODECOV_URL = 'https://codecov.io/bash'

// `codecov` upload script is in Bash and the repository does not have any
// `package.json` so we can't use `npm`.
// Using `curl` to retrieve it is slower in CI and randomly fails so we
// run this Gulp task instead anytime the script has a new version.
// Done in streaming mode for best performance.

export const download = async () => {
  const response = await got.stream(CODECOV_URL)
  const stream = createWriteStream(CODECOV_DIST)
  await pipeline(response, stream)
}

download.description = 'Download latest codecov upload script'
