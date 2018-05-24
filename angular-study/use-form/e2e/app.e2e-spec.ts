import { UseFormPage } from './app.po';

describe('use-form App', () => {
  let page: UseFormPage;

  beforeEach(() => {
    page = new UseFormPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
