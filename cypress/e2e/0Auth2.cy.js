
describe('OAuth2 Flow Examples', () => {
    let accesstoken = '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';

    it("requests an access token and calls a protected API", ()=> {
        cy.request({
          method: 'POST',
          url: 'https://github.com/login/oauth/access_token',
          qs: {
            client_id: 'Ov23lisifTeEqVPzDlXo',
            client_secret: '49b8936a0a6ee94f1982270cf3f84eaa9a8580e8',
            code:'0eb3922491b12bef369e'
          }
        })
        .then((response) => {
          const params=response.body.split('&')
          accesstoken=params[0].split('=')[1]
        })
      })

/*it('Fetches user repositories', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.github.com/user/repos',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        'User-Agent': 'CypressTest'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Found ${response.body.length} repos`);
    });
  });*/
    })
