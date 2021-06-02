import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import _ from 'underscore'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import routes from './routes.js'
import { setSessionCookie } from './session.js'

const JSONBodyParser = bodyParser.json()

export function init (host, port) {
  const app = express()
  app.use(morgan('dev'))

  app.post('/login/:orgid?', JSONBodyParser, (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    routes.login(req.body, req.params.orgid, domain).then(user => {
      return setSessionCookie(user, res).then(() => res.json(user))
    }).catch(next)
  })

  app.post('/inform', JSONBodyParser, (req, res, next) => {
    routes.inform(req.body).then(url => res.json({ status: 'ok' })).catch(next)
  })

  function logout (req, res, next) {
    req.session.destroy(err => {
      return err ? next(err) : res.send('ok')
    })
  }
  app.get('/logout', logout)
  app.post('/logout', logout)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  try {
    const host = process.env.HOST || '127.0.0.1'
    const port = process.env.PORT || 3000
    const app = init(host, port)
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`frodo do magic on ${host}:${port}`)
    })
  } catch (err) {
    console.error(err)
  }
}
