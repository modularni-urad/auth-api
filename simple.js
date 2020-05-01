import bodyParser from 'body-parser'
import express from 'express'

function hashCode (s) {
  for (var i = 0, h = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return h < 0 ? h * -10 : h
}

const app = express()

app.post('/login', bodyParser.json(), (req, res, next) => {
  if (!req.body.passwd || !req.body.uname || req.body.uname.length > 16) {
    return next('wrong data')
  }
  let id = hashCode(req.body.uname)
  while (id > 2147483646) {
    id = id / 8
  }
  const user = {
    id: Math.floor(id),
    username: req.body.uname,
    email: req.body.uname + '@test.test'
  }
  req.session.user = user
  res.json(user)
})

export default app
