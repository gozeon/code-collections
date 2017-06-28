import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router';
const { Content } = Layout;

function About() {
  return (
    <Content>
      <center>
        <h1>About</h1>
        <ol>
          <li><Link to="/main/production-tiler">生产切片</Link></li>
        </ol>
      </center>
    </Content>
  );
}

export default About;
