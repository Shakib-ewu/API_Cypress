describe('Query parameters — cy.request with qs', () => {
  it('sends query params using the qs option', () => {
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/comments',
      qs: {
        postId: 1,
        _limit: 3
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      // ensure we got an array back and every item has postId=1
      expect(response.body).to.be.an('array')
      expect(response.body).to.have.length.at.most(3)
      response.body.forEach(item => {
        expect(item).to.have.property('postId', 1)
      })
    })
  })
})