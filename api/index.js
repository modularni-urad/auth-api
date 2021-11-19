import _ from 'underscore'
import MW from './middleware.js'
import { setSessionCookie, destroySessionCookie } from './session.js'

export default function init (ctx) {
  const { express } = ctx
  const JSONBodyParser = express.json()
  const api = express()

  api.post('/login/:source', JSONBodyParser, (req, res, next) => {
    MW.login(req.body, req.params.source, req.orgconfig, req.orgdomain).then(user => {
      return setSessionCookie(user, res).then(() => res.json(user))
    }).catch(next)
  })

  api.get('/info/:uid', (req, res, next) => {
    MW.userinfo(req.body, req.params.orgid, domain).then(user => {
      return setSessionCookie(user, res).then(() => res.json(user))
    }).catch(next)
  })

  api.get('/search/', (req, res, next) => {
    if (!req.params.query) return next('wrong query')
    MW.search(req.params.query, domain).then(found => {
      res.json(user)
    }).catch(next)
  })

  // api.post('/inform', JSONBodyParser, (req, res, next) => {
  //   MW.inform(req.body).then(url => res.json({ status: 'ok' })).catch(next)
  // })

  function logout (req, res, next) {
    destroySessionCookie(res)
    res.send('ok')
  }
  api.get('/logout', logout)
  api.post('/logout', logout)

  return api
}