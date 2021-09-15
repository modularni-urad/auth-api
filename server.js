import init from './index'

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  const app = init(host, port)
  app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`frodo do magic on ${host}:${port}`)
  })
} catch (err) {
  console.error(err)
}
