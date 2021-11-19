import express from 'express'

export default function (port, g) {
  const app = express()

  app.get('/:orgid/mship/:uid/groups', (req, res) => {
    g.sharedBasket.push([req.body, req.params])
    res.json(g.usergroups)
  })

  return app.listen(port)
}