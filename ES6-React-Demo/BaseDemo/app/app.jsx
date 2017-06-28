import React from 'react';
import { render } from 'react-dom';
import Profile from './Profile';

// function App() {
//   return (
//     <div className="container">
//       <h1>Hello World!</h1>
//     </div>
//   );
// }
const app = document.createElement('div');
document.body.appendChild(app);
// ReactDOM.render(<App />, app);

const props = {
  name: 'viking',
  age: 20
};
render(<Profile {...props} />, app);
