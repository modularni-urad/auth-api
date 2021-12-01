
module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)
  const u1 = {
    username: 'admin',
    password: 'secret'
  }

  return describe('login', () => {

    it('must not login p1', async () => {
      g.error = true
      const u = { username: 'admin', password: 'wrong' }
      const res = await r.post('/login/mutabor').send(u)
      res.status.should.equal(401)
    })

    it('shall login p1', async () => {
      g.error = false
      const res = await r.post('/login/mutabor').send(u1)
      res.status.should.equal(200)
      g.chai.expect(res).to.have.cookie(process.env.SESSION_COOKIE_NAME, 'beeep')
      res.body.id.should.equal(g.mockUser.id)
    })

    it('shall login p1 and get token in header', async () => {
      const res = await r.post('/login/mutabor?token=1').send(u1)
      res.status.should.equal(200)
      res.header.token.should.be.ok
    })

    // it('shall create a new item p1', async () => {
    //   g.error = false
    //   const res = await r.post('/login/mutaborext').send(u1)
    //   res.status.should.equal(200)
      
    //   console.log(g.sharedBasket)
    //   console.log(res.body)
    // })

    it('shall logout', async () => {
      const res = await r.post('/logout')
      res.status.should.equal(200)
      g.chai.expect(res).not.to.have.cookie(process.env.SESSION_COOKIE_NAME)
    })

  })
}
