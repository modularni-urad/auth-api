import express from 'express'
import jwt from 'jsonwebtoken'

function getToken (req) {
  const auth = req.headers.authorization
  return auth && auth.match(/JWT .+$/)
    ? auth.split(' ')[1]
    : req.query.token
}

const app = express()

app.post('/login', (req, res, next) => {
  const token = getToken(req)
  jwt.verify(token, process.env.SHARED_SECRET, (err, decoded) => {
    if (err) return next(err)
    if (decoded.user && decoded.user.local) {
      req.session.user = decoded.user.local
      req.session.user.id = decoded.user._id
      req.session.user.groups = ['ooth']
    } else {
      req.session.user = decoded
    }
    res.json(req.session.user)
    next()
  })
})

export default app
