import React, { Component } from "react";
import { connect } from "react-redux";
import { SmileOutlined, MehOutlined } from "@ant-design/icons";
import { Form, Input, notification, Button } from "antd";
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
const happyIcon = <SmileOutlined style={{ color: "#108ee9" }} />;
const sadIcon = <MehOutlined style={{ color: "red" }} />;

class SignUp extends Component {
  state = {
    disabled: false,
  };

  onFinish = (values) => {
    if (values.password !== values.confirmPassword) {
      this.SignUpNotification(
        "Password Mismatch",
        "Password and confirm password have to match",
        sadIcon
      );
      return;
    }
    this.toggleDisable();
    this.props.userpool.signUp(
      values.email,
      values.password,
      [],
      null,
      (err, data) => {
        if (err) {
          console.error(err);
          this.SignUpNotification("SignUp Failed", err.message, sadIcon);
          this.toggleDisable();
        } else {
          this.SignUpNotification(
            "SignUp Successful",
            "SignUp Successful. Please confirm email now.",
            happyIcon
          );
          this.toggleDisable();
        }
      }
    );
  };
  toggleDisable = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };
  onFinishFailed = (errorInfo) => {
    this.SignUpNotification("SignUp Failed", errorInfo, sadIcon);
  };

  SignUpNotification = (desc, msg, icon) => {
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
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.disabled}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userpool: state.mr.UserPool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
