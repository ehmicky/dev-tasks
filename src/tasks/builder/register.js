import babelRegister from '@babel/register'

import babelConfig from './.babelrc.js'

// Meant to be used when caller adds custom Gulp tasks that needs to be
// compiled with Babel. This should be called directly, not as a Gulp task,
// and before requiring the custom Gulp tasks.
babelRegister({ ...babelConfig, babelrc: false })
