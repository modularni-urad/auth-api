import session from 'express-session'

function createRedisStore () {
  const redis = require('redis')
  const RedisStore = require('connect-redis')(session)
  const redisClient = redis.createClient()
  return new RedisStore({ client: redisClient })
}

function createMemoryStore () {
  const MemoryStore = require('memorystore')(session)
  return new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}

export default session({
  store: createMemoryStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: process.env.NODE_ENV === 'production'
  }
})