import express from 'express'

export default function (port) {
  const app = express()

  app.get('/mship/:uid/groups', (req, res) => {
    res.json(['administrators'])
  })

  return app.listen(port)
}