import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Layout, Menu, Icon } from 'antd';
const { Sider, Footer } = Layout;

import './style.scss';

const propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      mode: 'inline'
    };

    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse(collapsed) {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    });
  }

  render() {
    const selectKey = hashHistory.getCurrentLocation().pathname;
    return (
      <Layout id="main">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            {this.state.collapsed ? <span>G</span> : <span>Gago ToolBox</span>}
          </div>
          <Menu theme="dark" mode={this.state.mode} selectedKeys={[selectKey]}>
            <Menu.Item key="/main/production-tiler">
              <Link to="/main/production-tiler">
                <Icon type="folder-add" />
                <span className="nav-text">生产切片</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/main/about">
              <Link to="/main/about">
                <Icon type="question-circle-o" />
                <span className="nav-text">关于</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          {this.props.children}
          <Footer style={{ textAlign: 'center' }}>
            Gago ToolBox ©2017 Created by goze
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = propTypes;

export default Main;
