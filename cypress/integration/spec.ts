describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.get('app-root h1').contains('Ristorante Con Fusion')
  })

  it('should navigate to about us page by clicking on the link', () => {
    cy.visit('/')

    const navlink = cy.get('a').eq(1)
    navlink.click();

    cy.get('h3').contains('About Us');
  });

  it('should enter a new comment for the first dish', () => {
    cy.visit('/dishdetail/0');

    const newAuthor = cy.get('input[type=text]');
    newAuthor.type('Test Author');

    const newComment = cy.get('textarea');
    newComment.type('Test Comment');

    const newSubmitButton = cy.get('button[type=submit]');
    newSubmitButton.click();
  });
})
