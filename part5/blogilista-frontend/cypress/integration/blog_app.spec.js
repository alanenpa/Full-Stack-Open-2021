
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'John Smith',
      username: 'testUser',
      password: 'qwerty'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('qwerty')
      cy.contains('login').click()

      cy.get('.notification').contains('logged in as John Smith')
      cy.contains('John Smith logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('salasana')
      cy.contains('login').click()

      cy.get('.notification').contains('wrong username or password')
      cy.get('html').should('not.contain', 'John Smith logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('qwerty')
      cy.contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('The Final Frontier')
      cy.get('#author').type('Stephen Hawking')
      cy.get('#url').type('space.net')
      cy.get('#submit').click()

      cy.get('.notification').contains('a new blog The Final Frontier added!')
      cy.contains('The Final Frontier Stephen Hawking')
      cy.get('.hiddenContent').should('not.be.visible')
    })

    describe('And a blog has been created', () => {
      beforeEach(function () {
        cy.get('#newBlog').click()
        cy.get('#title').type('The Final Frontier')
        cy.get('#author').type('Stephen Hawking')
        cy.get('#url').type('space.net')
        cy.get('#submit').click()
        cy.wait(1000)
      })

      it('hidden content will be shown', function() {
        cy.contains('The Final Frontier Stephen Hawking').click()
        cy.get('.hiddenContent').should('be.visible')
      })

      it('A blog can be liked', function() {
        cy.contains('The Final Frontier Stephen Hawking').click()
        cy.get('.hiddenContent').contains(0)
        cy.get('#like').click()

        cy.get('.hiddenContent').contains(1)
      })

      it('A blog can be removed', function() {
        cy.contains('The Final Frontier Stephen Hawking').click()
        cy.get('#remove').click()
        cy.get('html').should('not.contain', 'The Final Frontier Stephen Hawking')
      })

      it('A blog can\'t be removed by another user', function() {
        cy.contains('logout').click()
        const user = {
          name: 'Jane Smith',
          username: 'testUser2',
          password: 'qwerty'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.wait(4000)
        cy.get('#username').type('testUser2')
        cy.get('#password').type('qwerty')
        cy.contains('login').click()
        cy.contains('The Final Frontier Stephen Hawking').click()
        cy.get('.hiddenContent').should('be.visible')
        cy.get('#remove').should('not.be.visible')
      })

      it('Blogs are sorted by likes', function() {
        cy.get('#newBlog').click()
        cy.get('#title').type('Laws of Motion')
        cy.get('#author').type('Isaac Newton')
        cy.get('#url').type('objectandforces.com')
        cy.get('#submit').click()
        cy.wait(4000)
        cy.get('#bloglist>li').eq(1).contains('Laws of Motion')
        cy.contains('Laws of Motion Isaac Newton').click()
        cy.get('#bloglist>li').eq(1)
          .within(() => cy.get('#like').click())
          .wait(4000)
        cy.get('#bloglist>li').eq(0).contains('Laws of Motion')
      })
    })
  })
})