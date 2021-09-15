import express from 'express'
import morgan from 'morgan'
import _ from 'underscore'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import routes from './routes.js'
import { setSessionCookie, destroySessionCookie } from './session.js'

const JSONBodyParser = express.json()

export default function init (host, port) {
  const app = express()
  app.use(morgan('dev'))

  app.post('/login/:orgid?', JSONBodyParser, (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    routes.login(req.body, req.params.orgid, domain).then(user => {
      return setSessionCookie(user, res).then(() => res.json(user))
    }).catch(next)
  })

  app.get('/info/:uid', (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    routes.userinfo(req.body, req.params.orgid, domain).then(user => {
      return setSessionCookie(user, res).then(() => res.json(user))
    }).catch(next)
  })

  app.get('/search/', (req, res, next) => {
    const domain = process.env.DOMAIN || req.hostname
    if (!req.params.query) return next('wrong query')
    routes.search(req.params.query, domain).then(found => {
      res.json(user)
    }).catch(next)
  })

  app.post('/inform', JSONBodyParser, (req, res, next) => {
    routes.inform(req.body).then(url => res.json({ status: 'ok' })).catch(next)
  })

  function logout (req, res, next) {
    destroySessionCookie(res)
    res.send('ok')
  }
  app.get('/logout', logout)
  app.post('/logout', logout)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}