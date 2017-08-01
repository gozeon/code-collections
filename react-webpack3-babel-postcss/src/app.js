import React from 'react';
import ReactDOM from 'react-dom';

import './app.scss';

function Page() {
  return (
    <div>
      <h1 className="title">React Learning</h1>
    </div>
  )
}

ReactDOM.render(<Page />, document.querySelector('#app'));
