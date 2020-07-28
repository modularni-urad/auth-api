import bodyParser from 'body-parser'
import express from 'express'
import _ from 'underscore'
import str from 'underscore.string'

const users = JSON.parse(process.env.USERS)

const app = express()

function hashCode (s) {
  for (var i = 0, h = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return h < 0 ? h * -10 : h
}

function getUID (uname) {
  let id = hashCode(uname)
  while (id > 2147483646) {
    id = id / 8
  }
  return Math.floor(id)
}

export function simpleUserInfo (uid) {
  const u = _.find(users, (i) => {
    return uid === getUID(i[0])
  })
  return u ? {
    id: getUID(u[0]),
    username: u[0],
    email: u[0] + '@mutabor.cz'
  } : null
}

export function findProfiles (query) {
  return _.reduce(users, (acc, i) => {
    if (str.include(i[0], query)) {
      acc.push({ id: getUID(i[0]), name: i[0] })
    }
    return acc
  }, [])
}

app.post('/login', bodyParser.json(), (req, res, next) => {
  if (!req.body.passwd || !req.body.uname) {
    return next('wrong credentials')
  }
  const u = _.find(users, (i) => req.body.uname === i[0])
  if (!u || req.body.passwd !== u[1]) {
    return next('wrong credentials')
  }
  const user = {
    id: getUID(req.body.uname),
    username: req.body.uname,
    email: req.body.uname + '@mutabor.cz',
    groups: ['employees'].concat(u.length > 2 ? u[2] : [])
  }
  req.session.user = user // save to session (thus cookie set ...)
  res.json(user)
})

export default app
