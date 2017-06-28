import * as React from 'react';

import * as insertCSS from 'insert-css';

const style = require('./style.css');
insertCSS(style);

export default class ShowIndex extends React.Component<{}, {}> {
  render() {
    return (
      <h1>Hello World</h1>
    )
  }
}

// export default ShowIndex;
