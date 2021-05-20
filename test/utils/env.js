import path from 'path'
process.env.PORT = 33333
process.env.DATABASE_URL = ':memory:'
process.env.NODE_ENV = 'test'
process.env.CONF_FOLDER = path.resolve(path.dirname(__filename), '../confs')
process.env.DOMAIN = 'testdomain.cz'
process.env.USER_SVC_URLS = '{"mutabor":"http://localhost:4444"}'
process.env.GROUP_SVC_URL = 'http://localhost:4445'
process.env.SESSION_SECRET = 'secret'