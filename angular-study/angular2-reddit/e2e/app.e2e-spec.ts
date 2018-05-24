import { Angular2RedditPage } from './app.po';

describe('angular2-reddit App', () => {
  let page: Angular2RedditPage;

  beforeEach(() => {
    page = new Angular2RedditPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
