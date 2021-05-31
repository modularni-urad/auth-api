/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const u1 = {
    username: 'admin',
    password: 'secret'
  }

  return describe('login', () => {

    it('shall login p1', async () => {
      const res = await r.post('/login/mutabor').send(u1)
      res.status.should.equal(200)
      console.log(res.body)
    })

    it('shall create a new item p1', async () => {
      const res = await r.post('/login/mutaborext').send(u1)
      res.status.should.equal(200)
      chai.expect(res).to.have.cookie(process.env.SESSION_COOKIE_NAME)
      console.log(g.sharedBasket)
      console.log(res.body)
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
