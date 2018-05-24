import { AngularHowWorkPage } from './app.po';

describe('angular-how-work App', () => {
  let page: AngularHowWorkPage;

  beforeEach(() => {
    page = new AngularHowWorkPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
