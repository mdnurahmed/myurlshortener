import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { Form, Input, Checkbox, notification, Button } from "antd";
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

class Login extends Component {
  state = {
    disabled: false,
  };
  onFinish = (values) => {
    const user = new CognitoUser({
      Username: values.email,
      Pool: this.props.userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password,
    });
    this.toggleDisable();
    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        this.props.Login();
        this.loginNotification(
          "Login Successful",
          "Welcome to my url shortener.",
          happyIcon
        );
        this.toggleDisable();
      },

      onFailure: (err) => {
        console.error("onFailure:", err);
        this.loginNotification("Login Falied", err.message, sadIcon);
        this.toggleDisable();
      },

      newPasswordRequired: (data) => {},
    });
  };

  onFinishFailed = (errorInfo) => {};
  toggleDisable = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };
  loginNotification = (desc, msg, icon) => {
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

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.disabled}>
              Login
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
  return {
    Login: () => dispatch(actionCreators.login()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
