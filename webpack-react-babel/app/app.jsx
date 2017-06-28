import React from 'react';
import ReactDOM from 'react-dom';

import './app.scss';

function App() {
  return (
    <div className="container">
      <div className="bg_img" />
    </div>
  );
}
const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App />, app);
