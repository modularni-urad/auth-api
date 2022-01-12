import MWarez from './middleware.js'
import Session from './session.js'

export default function init (ctx) {
  const { express, bodyParser, auth } = ctx
  const api = express()
  const session = Session(ctx)
  const MW = MWarez(ctx)

  api.post('/login/:source', bodyParser, (req, res, next) => {
    MW.login(req.body, req.params.source, req.tenantid, req.tenantcfg).then(user => {
      return (req.query.token
        ? session.setToken(user, res)
        : session.setSessionCookie(user, res)).then(() => res.json(user))
    }).catch(next)
  })

  api.get('/info/:uid', (req, res, next) => {
    MW.userinfo(req.params.uid, req.tenantid, req.tenantcfg).then(user => {
      res.json(user)
    }).catch(next)
  })

  api.get('/search', (req, res, next) => {
    MW.search(req.query.q, req.tenantid, req.tenantcfg).then(found => {
      res.json(found)
    }).catch(next)
  })

  app.get('/profile', auth.session, auth.required, function (req, res) {
    res.json(req.user)
  })

  // api.post('/inform', JSONBodyParser, (req, res, next) => {
  //   MW.inform(req.body).then(url => res.json({ status: 'ok' })).catch(next)
  // })

  function logout (req, res, next) {
    session.destroySessionCookie(res)
    res.send('ok')
  }
  api.get('/logout', logout)
  api.post('/logout', logout)

  return api
}