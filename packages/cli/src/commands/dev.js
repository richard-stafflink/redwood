import path from 'path'

import concurrently from 'concurrently'

import { getPaths } from 'src/lib'
import c from 'src/lib/colors'

export const command = 'dev [app..]'
export const desc = 'Run development servers.'
export const builder = {
  app: { choices: ['db', 'api', 'web'], default: ['db', 'api', 'web'] },
}

export const handler = ({ app }) => {
  const { base: BASE_DIR } = getPaths()

  const jobs = {
    api: {
      name: 'api',
      command: `cd ${path.join(BASE_DIR, 'api')} && yarn dev-server`,
      prefixColor: 'cyan',
    },
    db: {
      name: ' db',
      command: `cd ${path.join(
        BASE_DIR,
        'api'
      )} && yarn prisma2 generate --watch`,
      prefixColor: 'magenta',
    },
    web: {
      name: 'web',
      command: `cd ${path.join(
        BASE_DIR,
        'web'
      )} && yarn webpack-dev-server --config ../node_modules/@redwoodjs/scripts/config/webpack.development.js`,
      prefixColor: 'blue',
    },
  }

  concurrently(
    Object.keys(jobs)
      .map((n) => app.includes(n) && jobs[n])
      .filter(Boolean),
    {
      restartTries: 3,
      prefix: '{time} {name} |',
      timestampFormat: 'HH:mm:ss',
    }
  ).catch((e) => {
    console.log(c.error(e.message))
  })
}
