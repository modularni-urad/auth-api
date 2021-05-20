import axios from 'axios'

const GROUP_SVC_URL = process.env.GROUP_SVC_URL || 'http://group_svc/'
const USER_SVC_URLS = process.env.USER_SVC_URLS
  ? JSON.parse(process.env.USER_SVC_URLS)
  : { '': 'http://internal_svc/' }

async function login (body, orgid) {
  if (!body.password || !body.username || !USER_SVC_URLS[orgid]) { 
    throw new Error('wrong credentials')
  }
  const userReq = await axios.post(`${USER_SVC_URLS[orgid || '']}/login`)
  const groupReq = await axios.get(`${GROUP_SVC_URL}/mship/${userReq.data.id}/groups`)
  return Object.assign(userReq.data, { groups: groupReq.data })
}

const SMS_SEND_URL = process.env.SMS_SEND_URL
async function inform (body) {
  const profile = await getProfile(body.UID)
  const url = `${SMS_SEND_URL}/?num=${profile.phone}&mess=${body.message}`
  const res = await axios.post(url)
  return res.data
}

export default { login, inform }