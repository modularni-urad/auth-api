import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'
import redis from 'redis'
import axios from 'axios'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import ldapDB from './ldap'
import jwtLogin from './jwt'
// import InitNIA from './nia'
const OBSOLETE_AUTH_EP = process.env.OBSOLETE_AUTH_EP
const SMS_SEND_URL = process.env.SMS_SEND_URL

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
  app.post('/login', bodyParser.json(), async (req, res, next) => {
    if (!req.body.passwd || !req.body.uname) {
      return next('wrong credentials')
    }
    try {
      const user = await ldapDB.login(req.body)
      req.session.user = user // save to session (thus cookie set ...)
      res.json(user)
    } catch (e) {
      next(e)
    }
  })
  app.use('/jwt', jwtLogin)

  async function getProfile (uid) {
    const u = await ldapDB.userInfo(parseInt(uid))
    if (u) return u
    const res = await axios(`${OBSOLETE_AUTH_EP}/local/userinfo?userId=${uid}`)
    return res.status === 200 && res.data ? res.data : null
  }

  app.get('/uinfo/:uid', (req, res, next) => {
    const uids = req.params.uid.split(',')
    Promise.all(uids.map(i => getProfile(i))).then(results => {
      res.json(results)
    }).catch(next)
  })

  app.get('/profiles', (req, res, next) => {
    // vrati pary (uid: jmeno) na zaklade queryparam q
    res.json(ldapDB.findProfiles(req.query.q))
  })

  app.post('/inform', bodyParser.json(), async (req, res, next) => {
    try {
      const profile = await getProfile(req.body.UID)
      const url = `${SMS_SEND_URL}/?num=${profile.phone}&mess=${req.body.message}`
      await axios.post(url)
    } catch (err) { next(err) }
  })

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
