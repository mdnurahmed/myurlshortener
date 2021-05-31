import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Row, Col, notification } from "antd";
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

class ForgotPassword extends Component {
  state = {
    disabled: false,
    page: 0,
    type1: "",
    type2: "",
  };
  changePage = (page) => {
    if (page === 1) {
      this.setState({
        page: page,
        type1: "primary",
        type2: "",
      });
    } else {
      this.setState({
        page: page,
        type1: "",
        type2: "primary",
      });
    }
  };
  onFinishSendCode = (values) => {
    this.toggleDisable();
    let userData = {
      Username: values.username,
      Pool: this.props.userpool,
    };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        this.ForgotPasswordNotification(
          "Code sending was succesful",
          "Password reset code was sent to your email ",
          happyIcon
        );
        this.toggleDisable();
      },
      onFailure: (err) => {
        this.ForgotPasswordNotification(
          "Password Reset Failed",
          err.message,
          sadIcon
        );
        this.toggleDisable();
      },
    });
  };
  onFinishFailedSendCode = (err) => {
    //this.ForgotPasswordNotification("Password Reset Failed", err, sadIcon);
  };
  onFinishResetPassword = (values) => {
    this.toggleDisable();
    let userData = {
      Username: values.username,
      Pool: this.props.userpool,
    };
    var cognitoUser = new CognitoUser(userData);
    if (values.password !== values.confirmpassword) {
      this.ForgotPasswordNotification(
        "Password Reset Failed",
        "Password doesnt match",
        sadIcon
      );
      return;
    }
    cognitoUser.confirmPassword(values.code, values.password, {
      onFailure: (err) => {
        this.ForgotPasswordNotification(
          "Password Reset Failed",
          err.message,
          sadIcon
        );
        this.toggleDisable();
      },
      onSuccess: (v) => {
        this.ForgotPasswordNotification(
          "Password Reset Succesful",
          "You can login with your new password now.",
          happyIcon
        );
        this.toggleDisable();
      },
    });
  };
  onFinishFailedResetPassword = (err) => {
    //this.ForgotPasswordNotification("Password Reset Failed", err, sadIcon);
  };

  ForgotPasswordNotification = (desc, msg, icon) => {
    notification.open({
      message: desc,
      description: msg,
      duration: 0,
      icon: icon,
    });
  };
  toggleDisable = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };
  render() {
    let pageView = null;
    if (this.state.page === 1) {
      pageView = (
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <Form
              style={{ padding: "15px" }}
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinishSendCode}
              onFinishFailed={this.onFinishFailedSendCode}>
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.state.disabled}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      );
    } else if (this.state.page === 2) {
      pageView = (
        <Form
          style={{ padding: "15px" }}
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinishResetPassword}
          onFinishFailed={this.onFinishFailedResetPassword}>
          <Form.Item
            label="Email"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Please input your code!" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmpassword"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.disabled}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
    let navigationButtons = (
      <Row style={{ padding: "15px" }}>
        <Col style={{ padding: "15px" }} className="gutter-row" span={24}>
          <Button
            size="large"
            type={this.state.type1}
            disabled={this.state.disabled}
            onClick={() => this.changePage(1)}
            style={{
              fontFamily: "Candara",
            }}>
            Send me a code for reseting password
          </Button>
        </Col>
        <Col className="gutter-row" span={24}>
          <Button
            size="large"
            type={this.state.type2}
            disabled={this.state.disabled}
            onClick={() => this.changePage(2)}
            style={{
              fontFamily: "Candara",
            }}>
            I already have a code for reseting password
          </Button>
        </Col>
      </Row>
    );

    return (
      <div>
        {navigationButtons}
        {pageView}
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
