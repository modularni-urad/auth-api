import express from 'express'

export default function (port, basket = []) {
  const app = express()

  app.post('/sign', express.json(), (req, res) => {
    basket.push([req.body, req.hostname])
    res.json({ token: 'beeep' })
  })

  return app.listen(port)
}