import fs from 'fs'
import bodyParser from 'body-parser'
import assert from 'assert'
import NIA from 'node-nia-connector'

assert.ok(fs.existsSync(process.env.KEY_FILE), 'env.KEY_FILE not exist!')
assert.ok(fs.existsSync(process.env.CERT_FILE), 'env.CERT_FILE not exist!')

const NIAConnector = new NIA({
  audience: process.env.AUDIENCE,
  private_key: fs.readFileSync(process.env.KEY_FILE).toString(),
  certificate: fs.readFileSync(process.env.CERT_FILE).toString(),
  assert_endpoint: process.env.ASSERT_ENDPOINT
})

export default function (app) {
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/login', function (req, res, next) {
    const opts = {
      attrs: [
        { name: NIA.PROFILEATTRS.PERSON_IDENTIFIER, required: true },
        { name: NIA.PROFILEATTRS.GIVEN_NAME, required: true },
        { name: NIA.PROFILEATTRS.FAMILY_NAME, required: false },
        { name: NIA.PROFILEATTRS.CURRENT_ADDRESS, required: true },
        { name: NIA.PROFILEATTRS.CZMORIS_TR_ADRESA_ID, required: true },
        { name: NIA.PROFILEATTRS.DATE_OF_BIRTH, required: true },
        { name: NIA.PROFILEATTRS.EMAIL, required: false },
        { name: NIA.PROFILEATTRS.CZMORIS_PHONE_NUMBER, required: true },
        { name: NIA.PROFILEATTRS.CZMORIS_ID_TYPE, required: true },
        { name: NIA.PROFILEATTRS.CZMORIS_ID_NUMBER, required: true }
      ],
      level: NIA.LOA.SUBSTANTIAL
    }

    NIAConnector.createAuthRequestUrl(opts).then(loginUrl => {
      res.redirect(loginUrl)
    }).catch(next)
  })

  app.post('/ExternalLogin', function (req, res, next) {
    NIAConnector.postAssert(req.body).then(samlResponse => {
      req.session.user = samlResponse
      res.redirect(process.env.AFTERLOGIN_URL)
    }).catch(next)
  })

  app.get('/logout', (req, res, next) => {
    if (!req.user) return next('not logged in')
    const nameId = req.user.NameID
    const sessionIndex = req.user.SessionIndex
    NIAConnector.createLogoutRequestUrl(nameId, sessionIndex)
      .then(logoutUrl => { res.redirect(logoutUrl) })
      .catch(next)
  })

  app.post('/ExternalLogout', (req, res, next) => {
    try {
      const samlResponse = NIAConnector.logoutAssert(req.body)
      res.json(samlResponse)
    } catch (err) {
      next(err)
    }
  })
}
