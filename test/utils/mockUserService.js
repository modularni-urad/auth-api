import express from 'express'

export default function (port, g) {
  const app = express()

  app.post('/:orgid/login', express.json(), (req, res) => {
    g.sharedBasket.push([req.body, req.params])
    g.error 
      ? res.status(400).send('user not found') 
      : res.json(g.mockUser)
  })

  app.get('/:orgid/info/:uid', express.json(), (req, res) => {
    g.sharedBasket.push([req.body, req.params])
    g.error 
      ? res.status(404).send('user not found') 
      : res.json(g.mockUser)
  })

  app.get('/:orgid/search', express.json(), (req, res) => {
    res.json(g.to2found)
  })

  return app.listen(port)
}