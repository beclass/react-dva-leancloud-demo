import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class PicModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children,MolalTitle } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { name, sort,title } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };


    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title={MolalTitle}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {
                getFieldDecorator('name', {
                  initialValue: name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序"
            >
              {
                getFieldDecorator('sort', {
                  initialValue: sort,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {
                getFieldDecorator('title', {
                  initialValue: title,
                })(<Input />)
              }
            </FormItem>
            
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(PicModal);


