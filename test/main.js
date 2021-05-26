/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
import userServiceMockInitializer from './utils/mockUserService.js'
import groupServiceMockInitializer from './utils/groupUserService.js'
import { init } from '../server'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = process.env.PORT || 3333
const g = {
  baseurl: `http://localhost:${port}`,
  UID: 110,
  usergroups: [],
  sharedBasket: []
}
const mocks = {
  auth: {
    required: (req, res, next) => { return next() },
    requireMembership: (gid) => (req, res, next) => {
      return g.usergroups.indexOf(gid) >= 0 ? next() : next(403)
    },
    getUID: (req) => g.UID
  },
  ttn: { data: () => new Promise(resolve => resolve(g.ttnClient)) }
}

describe('app', () => {
  before(done => {
    const app = init(mocks)
    g.server = app.listen(port, '127.0.0.1', (err) => {
      if (err) return done(err)
      setTimeout(done, 1500)
    })
    g.usermock = userServiceMockInitializer(4444)
    g.usermockShared = userServiceMockInitializer(4446, g.sharedBasket)
    g.groupmock = groupServiceMockInitializer(4445)
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
    g.usermock.close()
    g.groupmock.close()
  })

  describe('API', () => {
    //
    const submodules = [
      './login'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
