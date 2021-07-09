import express from 'express'

export default function (port, g) {
  const app = express()

  app.post('/login', express.json(), (req, res) => {
    g.sharedBasket.push([req.body, req.hostname])
    g.error 
      ? res.status(400).send('user not found') 
      : res.json(g.mockuser)
  })

  return app.listen(port)
}