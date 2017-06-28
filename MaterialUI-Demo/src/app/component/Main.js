import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Test from './test';

const muiTheme = getMuiTheme({});

const Main = () => (
  
  <MuiThemeProvider muiTheme={muiTheme}>
    <Test />
  </MuiThemeProvider>
);

export default Main;