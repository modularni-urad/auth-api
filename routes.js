import axios from 'axios'

const GROUP_SVC_URL = process.env.GROUP_SVC_URL || 'http://group_svc/'
const USER_SVC_URLS = process.env.USER_SVC_URLS
  ? JSON.parse(process.env.USER_SVC_URLS)
  : { '': 'http://internal_svc/' }
const SHARED_USER_SVC = process.env.SHARED_USER_SVC

async function login (body, orgid, domain) {
  if (!body.password || !body.username || !USER_SVC_URLS[orgid]) { 
    throw new Error('wrong credentials')
  }
  const reqParams = { headers: { 'Host': domain } }
  const userSvcAddr = USER_SVC_URLS[orgid || '']
  const userSvcUrl = userSvcAddr.match(/^https?:\/\//) ? userSvcAddr : SHARED_USER_SVC
  const userReq = await axios.post(`${userSvcUrl}/login`, body, reqParams)
  const groupReqUrl = `${GROUP_SVC_URL}/mship/${userReq.data.id}/groups`
  const groupReq = await axios.get(groupReqUrl, reqParams)
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