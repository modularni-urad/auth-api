import path from 'path'
process.env.PORT = 33333
process.env.DATABASE_URL = ':memory:'
process.env.NODE_ENV = 'test'
process.env.CONF_FOLDER = path.resolve(path.dirname(__filename), '../confs')
process.env.DOMAIN = 'testdomain.cz'
process.env.USER_SVC_URLS = JSON.stringify({
  "mutabor":"http://localhost:4444",
  "mutaborext":"ts.eu"
})
process.env.GROUP_SVC_URL = 'http://localhost:4445'
process.env.SESSION_SERVICE = 'http://localhost:5000'
process.env.SESSION_SECRET = 'secret'
process.env.SHARED_USER_SVC = 'http://localhost:4446'
process.env.SESSION_COOKIE_NAME = 'Bearer'