import axios from 'axios'
// import session from 'express-session'
// function createRedisStore () {
//   const redis = require('redis')
//   const RedisStore = require('connect-redis')(session)
//   const redisClient = redis.createClient()
//   return new RedisStore({ client: redisClient })
// }

// function createMemoryStore () {
//   const MemoryStore = require('memorystore')(session)
//   return new MemoryStore({
//     checkPeriod: 86400000 // prune expired entries every 24h
//   })
// }

// const opts = {
//   store: createMemoryStore(),
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: process.env.NODE_ENV === 'production'
//   }
// }
// process.env.SESSION_COOKIE_NAME &&
//   Object.assign(opts, { name: process.env.SESSION_COOKIE_NAME })

export default (ctx) => {
  const SESSION_SVC = process.env.SESSION_SERVICE || 'http://session-svc'
  const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'Bearer'

  async function setSessionCookie(user, res) {
    const tokenReq = await axios.post(`${SESSION_SVC}/sign`, user)
    const token = tokenReq.data.token
    res.cookie(COOKIE_NAME, token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000 // 12h
    })
  }

  function destroySessionCookie (res) {
    res.clearCookie(COOKIE_NAME)
  }

  async function setToken (user, res) {
    const tokenReq = await axios.post(`${SESSION_SVC}/sign`, user)
    user.token = tokenReq.data.token
  }

  return { setSessionCookie, destroySessionCookie, setToken }
}