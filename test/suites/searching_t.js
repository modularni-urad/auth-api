
module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)

  return describe('searching', () => {

    it('must fail with wrong filter', async () => {
      const res = await r.get('/search')
      res.status.should.equal(400)
    })

    it('must return empty array', async () => {
      g.to2found = []
      const res = await r.get('/search?q=trw')
      res.status.should.equal(200)
      res.body.length.should.eql(0)
    })

    it('must return one item', async () => {
      g.to2found = [{ id: 44 }]
      const res = await r.get('/search?q=trw')
      res.status.should.equal(200)
      res.body.length.should.eql(1)
    })

    it('must return user info', async () => {
      g.error = false
      const res = await r.get('/info/1')
      res.status.should.equal(200)
    })

  })
}
