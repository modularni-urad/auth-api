import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
import redis from 'redis'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import simpleLogin from './simple'
import jwtLogin from './jwt'
// import InitNIA from './nia'

async function init (host, port) {
  const app = express()
  app.use(morgan('dev'))

  const RedisStore = require('connect-redis')(session)
  const redisClient = redis.createClient()
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production'
      }
    })
  )

  // const niaApp = express()
  // InitNIA(niaApp)
  // app.use('/nia', niaApp)
  app.use(simpleLogin)
  app.use('/jwt', jwtLogin)

  function logout (req, res, next) {
    req.session.destroy(err => {
      return err ? next(err) : res.send('ok')
    })
  }
  app.get('/logout', logout)
  app.post('/logout', logout)

  initErrorHandlers(app) // ERROR HANDLING
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT
  init(host, port)
} catch (err) {
  console.error(err)
}
