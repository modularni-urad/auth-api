import axios from 'axios'
import _ from 'underscore'
import { APIError } from 'modularni-urad-utils'

const GROUP_SVC_URL = process.env.GROUP_SVC_URL || 'http://group_svc/'
const SHARED_USER_SVC = process.env.SHARED_USER_SVC || 'http://internal_svc/'

async function internalUsersLogin(body, domain) {
  if (!body.password || !body.username) { 
    throw new APIError(401, 'wrong credentials')
  }
  const r = await axios.post(`${SHARED_USER_SVC}/${domain}/login`, body)
  return r.data
}

async function fillGroups (user, domain) {
  const groupReqUrl = `${GROUP_SVC_URL}/${domain}/mship/${user.id}/groups`
  const groupReq = await axios.get(groupReqUrl)
  return Object.assign(user, { groups: groupReq.data })
}

async function login (body, source, config, domain) {
  const userSvcAddr = _.get(config, ['users', source])
  try {
    const user = userSvcAddr
      ? await axios.post(userSvcAddr, body)
      : await internalUsersLogin(body, domain)
    return fillGroups(user, domain)
  } catch (err) {
    const c = err.config
    throw c 
      ? new APIError(401, `${c.url}${err.message}`)
      : err
  }
}

export function userinfo (uid, domain) {
  const reqParams = { headers: { 'Host': domain } }
  return axios.get(`${SHARED_USER_SVC}/info/${uid}`, reqParams)
}

export function search (query, domain) {
  const reqParams = { headers: { 'Host': domain } }
  return axios.get(`${SHARED_USER_SVC}/search?query=${query}`, reqParams)
}

const SMS_SEND_URL = process.env.SMS_SEND_URL
async function inform (body) {
  const profile = await getProfile(body.UID)
  const url = `${SMS_SEND_URL}/?num=${profile.phone}&mess=${body.message}`
  const res = await axios.post(url)
  return res.data
}

export default { login, inform }