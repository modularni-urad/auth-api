import ldap from 'ldapjs'
import { Pool } from 'ldap-pool'
import getGroups from './groups'

const LDAPOPTS = {
  url: process.env.LDAP_URL,
  userScope: process.env.LDAP_USERS_SCOPE || 'ou=users,o=data'
}

const clientOpts = {
  url: LDAPOPTS.url,
  connectTimeout: 1000,
  tlsOptions: { rejectUnauthorized: false }
}

const pool = Pool.create({
  connOpts: {
    url: LDAPOPTS.url,
    reconnect: true,
    idleTimeout: 30000
  },
  size: 4,
  dn: process.env.LDAP_ADMIN_DN,
  pwd: process.env.LDAP_ADMIN_PWD
})

const desiredAttrs = ['givenName', 'sn', 'cn', 'taborPersonalNumber', 'mail']
function _entry2Profile (entry) {
  return {
    id: Number(entry.object.taborPersonalNumber),
    username: entry.object.cn,
    name: `${entry.object.givenName} ${entry.object.sn}`,
    email: entry.object.mail,
  }
}

function _search (client, filter, attributes = desiredAttrs) {
  return new Promise((resolve, reject) => {
    const opts = { filter, scope: 'sub', attributes }
    client.search(LDAPOPTS.userScope, opts, function (err, res) {
      if (err) return reject(err)
      const rs = []

      res.on('searchEntry', (entry) => { rs.push(_entry2Profile(entry)) })
      res.on('error', (err) => { reject(err) })
      res.on('end', (result) => { resolve(rs) })
    })
  })
}

function userInfo (uid) {
  return pool.getClient().then(client => {
    return _search(client, `(taborPersonalNumber=${uid})`).then(res => {
      return res[0]
    })
  })
}

function findProfiles (query) {
  return pool.getClient().then(client => {
    return _search(client, `(cn=*${query}*)`)
  })
}

function login (body) {
  return pool.getClient().then(client => {
    return new Promise(function(resolve, reject) {
      const opts = { filter: `(cn=${body.uname})`, scope: 'sub', desiredAttrs }
      client.search(LDAPOPTS.userScope, opts, function (err, res) {
        if (err) return reject(err)
        let found = null

        res.on('searchEntry', (entry) => { found = entry })
        res.on('error', reject)
        res.on('end', (result) => {
          if (found === null) return reject(404)
          const c = ldap.createClient(clientOpts)
          c.bind(found.objectName, body.passwd, (err) => {
            const profile = _entry2Profile(found)
            profile.groups = getGroups(profile.id)
            return err ? reject(err) : resolve(profile)
          })
        })
      })
    })
  })
}

export default { login, findProfiles, userInfo }
