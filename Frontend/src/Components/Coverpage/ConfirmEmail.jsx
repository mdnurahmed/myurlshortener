import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, notification, Button } from "antd";
import { CognitoUser } from "amazon-cognito-identity-js";
import { SmileOutlined, MehOutlined } from "@ant-design/icons";

const happyIcon = <SmileOutlined style={{ color: "#108ee9" }} />;
const sadIcon = <MehOutlined style={{ color: "red" }} />;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

class ConfirmEmail extends Component {
  onFinish = (values) => {
    let userData = {
      Username: values.email,
      Pool: this.props.userpool,
    };
    let cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(values.secret, true, (err, result) => {
      if (err) {
        this.comfirmEmailNotification(
          "Email Confirmation Failed",
          err.message,
          sadIcon
        );
        return;
      }
      this.comfirmEmailNotification(
        "Email Confirmation Successful",
        "You can login now",
        happyIcon
      );
    });
  };

  onFinishFailed = (errorInfo) => {};
  comfirmEmailNotification = (desc, msg, icon) => {
    notification.open({
      message: desc,
      description: msg,
      duration: 0,
      icon: icon,
      onClick: () => {},
    });
  };
  render() {
    return (
      <div>
        <Form
          style={{ padding: "50px" }}
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Secret Code"
            name="secret"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Confirm Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail);
