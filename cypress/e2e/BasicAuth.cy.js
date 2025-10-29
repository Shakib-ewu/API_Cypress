import { method } from "lodash";

describe('Basic Authentication', () => {
    it('Basic Auth Test', () => {
        cy.request({
            method: 'GET',
            url: 'https://postman-echo.com/basic-auth',
            auth: {
                username: 'postman',
                password: 'password'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.authenticated).to.be.true;
        });
    });

    it('Digest Auth Test', () => {
        cy.request({
            method: 'GET',
            url: 'https://postman-echo.com/basic-auth',
            auth: {
                username: 'postman',
                password: 'password',
                method: 'DIGEST'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.authenticated).to.be.true;
        });
    });

    it('Bearer Token Auth Test', () => {
        const token = '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'; // Replace with a valid token
        cy.request({
            method: 'GET',
            url: 'https://api.github.com/user/repos',
            headers: {      
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });     
})