import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch
} from 'react-router-dom';

import { ShowIndex } from './components';

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <Router getUserConfirmation={() => {console.log(111); }}>
        <div>
          <Switch>
            <Route exact path="/" component={ShowIndex} />
            <Route render={() => <h1>404 NOT FOUND</h1>} />
          </Switch>
        </div>
      </Router>
    );
  }
}
