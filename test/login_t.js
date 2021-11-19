/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl + '/api.domain1.cz')
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
      chai.expect(res).to.have.cookie(process.env.SESSION_COOKIE_NAME, 'beeep')
      console.log(res.body)
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
      chai.expect(res).not.to.have.cookie(process.env.SESSION_COOKIE_NAME)
    })

    // it('shall get the pok1 with pagination', async () => {
    //   const res = await r.get('/?currentPage=1&perPage=10&sort=id:asc')
    //   res.status.should.equal(200)
    //   res.body.data.should.have.lengthOf(1)
    //   res.body.data[0].slug.should.equal(p1.slug)
    //   res.body.pagination.currentPage = 1
    // })

  })
}
