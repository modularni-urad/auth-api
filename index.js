import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import _ from 'underscore'
import {
  initErrorHandlers,
  initConfigManager,
  CORSconfigCallback,
  createLoadOrgConfigMW } from 'modularni-urad-utils'
import initAPI from './api/index'

export default async function init () {
  await initConfigManager(process.env.CONFIG_FOLDER)

  const app = express()
  
  app.use(morgan('dev'))
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))

  const appContext = { express }
  const api = initAPI(appContext)

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    req.orgdomain = req.params.domain
    return req.params.domain
  })
  app.use('/:domain/', loadOrgConfig, api)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}