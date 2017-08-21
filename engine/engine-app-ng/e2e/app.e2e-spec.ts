import { EngineAppPage } from './app.po';

describe('engine-app App', () => {
  let page: EngineAppPage;

  beforeEach(() => {
    page = new EngineAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
