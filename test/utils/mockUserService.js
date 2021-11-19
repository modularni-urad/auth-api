import express from 'express'

export default function (port, g) {
  const app = express()

  app.post('/:orgid/login', express.json(), (req, res) => {
    g.sharedBasket.push([req.body, req.params])
    g.error 
      ? res.status(400).send('user not found') 
      : res.json(g.mockUser)
  })

  return app.listen(port)
}