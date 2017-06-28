import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { Spin } from 'antd';

import NoMatch from './NoMatch';
import Main from './Main';
import Tiler from './Tiler';
import About from './About';

const app = document.createElement('div');
document.body.appendChild(app);

const propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};
function App(props) {
  return (
    <div>{props.children}</div>
  );
}
App.propTypes = propTypes;

class Loading extends React.Component {
  // 不完善，应该去检测js是否加载完成
  componentDidMount() {
    setTimeout(() => {
      hashHistory.push('/main/about');
    }, 2000);
  }
  render() {
    return (
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.05)',
          position: 'absolute',
          height: '100%',
          width: '100%',
          textAlign: 'center',
          paddingTop: '25%'
        }}
      >
        <Spin size="large" tip="Loading" />
      </div>
    );
  }
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Loading} />
      <Route path="/main" component={Main}>
        <Route path="production-tiler" component={Tiler} />
        <Route path="about" component={About} />
      </Route>

      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
), app);
