import bodyParser from 'body-parser'
import express from 'express'
import _ from 'underscore'
import str from 'underscore.string'

const users = JSON.parse(process.env.USERS)

const app = express()

export function simpleUserInfo (uid) {
  const u = _.find(users, (i) => {
    return uid === i[3]
  })
  return u ? {
    id: u[3],
    username: u[0],
    email: u[0] + '@mutabor.cz'
  } : null
}

export function findProfiles (query) {
  return _.reduce(users, (acc, i) => {
    if (str.include(i[0], query)) {
      acc.push({ id: i[3], name: i[0] })
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
    id: u[3],
    username: req.body.uname,
    email: req.body.uname + '@mutabor.cz',
    groups: ['employees'].concat(u.length > 2 ? u[2] : [])
  }
  req.session.user = user // save to session (thus cookie set ...)
  res.json(user)
})

export default app
