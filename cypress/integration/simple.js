describe('Assignments', () => {
  it('login and assign to a Role', () => {
    cy.visit('http://localhost:8085/#/login')

    cy.contains('Login here.').click()

    cy.contains('LOGIN WITH KEY').click()

    cy.get('input[aria-label="Account"]').type('johnnyhypha1')

    cy.get('input[aria-label="Private key"]').type('5HwnoWBuuRmNdcqwBzd1LABFRKnTk2RY2kUMYKkZfF8tKodubtK')

    cy.contains('Login').click()

    // Should be on the Dashboard
    cy.url().should('include', '/dashboard')
  })
})
