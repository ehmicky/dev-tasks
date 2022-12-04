// eslint-disable-next-line import/order
import { build } from '@ehmicky/dev-tasks'

import '@ehmicky/dev-tasks/register.js'
import test from 'ava'

test('Dummy test', (t) => {
  t.is(typeof build, 'function')
})
