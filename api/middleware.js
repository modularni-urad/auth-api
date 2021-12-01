
export default (ctx) => {
  const { ErrorClass } = ctx
  const GROUP_SVC_URL = process.env.GROUP_SVC_URL || 'http://group_svc/{{TENANTID}}'
  const SHARED_USER_SVC = process.env.SHARED_USER_SVC || 'http://internal_svc/{{TENANTID}}/login'
  const axios = ctx.require('axios')
  const _ = ctx.require('underscore')

  async function internalUsersLogin(body, tenantid) {
    if (!body.password || !body.username) { 
      throw new ErrorClass(401, 'wrong credentials')
    }
    const userServiceURL = SHARED_USER_SVC.replace('{{TENANTID}}', tenantid)
    const r = await axios.post(userServiceURL, body)
    return r.data
  }

  async function fillGroups (user, tenantid) {
    const TENANT_GROUP_SVC_URL = GROUP_SVC_URL.replace('{{TENANTID}}', tenantid)
    const groupReqUrl = `${TENANT_GROUP_SVC_URL}/mship/${user.id}/groups`
    const groupReq = await axios.get(groupReqUrl)
    return Object.assign(user, { groups: groupReq.data })
  }

  async function login (body, source, tenantid, config) {
    const userSvcAddr = _.get(config, ['users', source])
    try {
      const user = userSvcAddr
        ? await axios.post(userSvcAddr, body)
        : await internalUsersLogin(body, tenantid)
      return fillGroups(user, tenantid)
    } catch (err) {
      const c = err.config
      throw c 
        ? new ErrorClass(401, `${c.url}${err.message}`)
        : err
    }
  }

  function userinfo (uid, tenantid) {
    const reqParams = { headers: { 'Host': domain } }
    return axios.get(`${SHARED_USER_SVC}/info/${uid}`, reqParams)
  }

  function search (query, tenantid) {
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

  return { login, inform }
}