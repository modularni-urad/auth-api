import express from 'express'

export default function (port) {
  const app = express()

  app.post('/login', (req, res) => {
    res.json({
      id: 111,
      name: 'gandalf'
    })
  })

  return app.listen(port)
}