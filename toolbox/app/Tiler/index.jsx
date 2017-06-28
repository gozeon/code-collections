import React from 'react';
import { Form, Input, Button, Switch, Slider, Spin, message, Layout } from 'antd';
const { Content } = Layout;
const FormItem = Form.Item;

class Tiler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputPath: '',
      email: '',
      level: [2, 7],
      isLerc: false,
      loading: false
    };

    this.sliderChange = this.sliderChange.bind(this);
    this.inputPathChange = this.inputPathChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.switchChange = this.switchChange.bind(this);
    this.onSublimt = this.onSublimt.bind(this);
  }

  onSublimt(e) {
    e.preventDefault();

    this.setState({ loading: true });
    const bodyData = {
      inputPath: this.state.inputPath,
      isLecr: this.state.isLerc,
      email: this.state.email,
      minLevel: this.state.level[0],
      maxLevel: this.state.level[1]
    };
    // const bodyContent = new FormData();
    // bodyContent.append('json', JSON.stringify(bodyData));
    fetch('http://139.219.239.252/job', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty('data')) {
          this.setState({
            inputPath: '',
            email: '',
            loading: false
          });
          message.loading('任务已经加入队列', 1.5);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.loading(`错误:${error}`, 1.5);
      });
  }

  inputPathChange(e) {
    const { value } = e.target;
    this.setState({ inputPath: value });
  }

  emailChange(e) {
    const { value } = e.target;
    this.setState({ email: value });
  }

  switchChange(checked) {
    this.setState({ isLerc: checked });
  }

  sliderChange(value) {
    this.setState({ level: value });
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4, offset: 6 },
      wrapperCol: { span: 6 }
    };

    const buttonItemLayout = {
      wrapperCol: {
        xs: { span: 14, offset: 10 }
      }
    };

    return (
      <Content>
        <Spin tip="Loading..." spinning={this.state.loading}>
          <div style={{ backgroundColor: '#fff', padding: '40px 50px' }}>
            <Form layout="horizontal" onSubmit={this.onSublimt}>
              <FormItem label={"文件路径："} {...formItemLayout}>
                <Input onChange={this.inputPathChange} required value={this.state.inputPath} />
              </FormItem>
              <FormItem label={"级别："} {...formItemLayout}>
                <Slider
                  min={0}
                  max={18}
                  step={1}
                  value={this.state.level}
                  range
                  onChange={this.sliderChange}
                />
              </FormItem>
              <FormItem label={"是否转lerc："} {...formItemLayout}>
                <Switch onChange={this.switchChange} checked={this.state.isLerc} />
              </FormItem>
              <FormItem label={"邮件："} {...formItemLayout}>
                <Input type="email" onChange={this.emailChange} required value={this.state.email} />
              </FormItem>
              <FormItem {...buttonItemLayout}>
                <Button type="primary" htmlType="submit" size="large">提交</Button>
              </FormItem>
            </Form>
          </div>
        </Spin>
      </Content>
    );
  }
}

export default Tiler;
