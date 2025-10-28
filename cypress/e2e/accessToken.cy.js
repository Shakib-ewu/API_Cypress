describe('Access Token API Example', () => {
  it('should retrieve a token from Reqres API', () => {
    cy.request({
      method: 'POST',
      url: 'https://reqres.in/api/login',
      headers: {
        'x-api-key': 'reqres-free-v1'
      },
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      },
      failOnStatusCode: false // Optional if you want to handle 401 manually
    }).then((response) => {
      cy.log(JSON.stringify(response.body));

      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
    });
  });
});
