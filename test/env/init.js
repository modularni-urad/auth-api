import path from 'path'
import express from 'express'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
import userServiceMockInitializer from '../utils/mockUserService.js'
import groupServiceMockInitializer from '../utils/groupUserService.js'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

process.env.NODE_ENV = 'test'
process.env.SESSION_SERVICE_PORT = 24000
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
const port = process.env.PORT || 3333

module.exports = function (g) {

  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42 },
    error: false,
    usergroups: [],
    sharedBasket: [],
    sessionBasket: []
  })
  process.env.GROUP_SVC_URL = 'http://localhost:4445/{{TENANTID}}'
  process.env.SESSION_SECRET = 'secret'
  process.env.SHARED_USER_SVC = 'http://localhost:4446/{{TENANTID}}'
  process.env.SESSION_COOKIE_NAME = 'Bearer'

  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  g.usermockShared = userServiceMockInitializer(4446, g)
  g.groupmock = groupServiceMockInitializer(4445, g)
  // g.usermock = userServiceMockInitializer(4444, g)

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    const app = express()
    const appContext = { 
      express, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    const tenantConfig = {
      users: {
        mutabor: null,
        external: 'http://localhost:4000'
      }
    }
    function setupTenant (req, res, next) {
      req.tenantid = 'pokus'
      req.tenantcfg = tenantConfig
      next()
    }
    const mwarez = ApiModule(appContext)
    app.use(setupTenant, mwarez)

    initErrorHandlers(app)
    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
  
  g.close = function(done) {
    g.sessionSrvcMock.close()
    g.usermockShared.close()
    g.groupmock.close()
    g.server.close(err => {
      return err ? done(err) : done()
    })
  }
}