import express from 'express'
import bodyParser from 'body-parser'

export default function (port, basket = []) {
  const app = express()

  app.post('/sign', bodyParser.json(), (req, res) => {
    basket.push([req.body, req.hostname])
    res.json({ token: 'beeep' })
  })

  return app.listen(port)
}