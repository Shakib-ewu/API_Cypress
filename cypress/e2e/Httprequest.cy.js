describe('API Testing with Cypress', () => {
    it('should successfully make a GET request', () => {
        // Making a GET request to a sample API endpoint
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
        }).then((response) => {
            // Verify the response status code is 200 (OK)
            expect(response.status).to.eq(200)

            // Verify that the response body contains expected data
            expect(response.body).to.have.property('id', 1)
            expect(response.body).to.have.property('userId')
            expect(response.body).to.have.property('title')
            expect(response.body).to.have.property('body')

            // Log the response body for debugging (optional)
            cy.log('Response Body:', response.body)
        })
    })

    it('Post method', () => {
        cy.request({
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/posts/',
            body: {
                title: 'foo',
                body: 'bar',
                userId: 1,  
            }
        }).then((response) => {
            // Verify the response status code is 201 (Created)
            expect(response.status).to.eq(201)
        })

})
})
