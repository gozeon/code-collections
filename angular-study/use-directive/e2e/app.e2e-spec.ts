import { UseDirectivePage } from './app.po';

describe('use-directive App', () => {
  let page: UseDirectivePage;

  beforeEach(() => {
    page = new UseDirectivePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
