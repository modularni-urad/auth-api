import express from 'express'
import bodyParser from 'body-parser'

export default function (port, basket = []) {
  const app = express()

  app.post('/login', bodyParser.json(), (req, res) => {
    basket.push([req.body, req.hostname])
    res.json({
      id: 111,
      name: 'gandalf'
    })
  })

  return app.listen(port)
}