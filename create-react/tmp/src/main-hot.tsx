require('es6-promise').polyfill();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './app';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};

render(App);

module.hot.accept('./app', () => {
  const NextApp = require('./app').default;
  render(NextApp);
 });
