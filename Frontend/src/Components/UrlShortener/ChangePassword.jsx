import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";
import { notification, Form, Input, Button } from "antd";
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

class ChangePassword extends Component {
  state = {
    disabled: false,
    page: 0,
  };
  onFinishResetPassword = (values) => {
    this.toggleDisable();
    const cognitoUser = this.props.userpool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          this.ChangePasswordNotification(
            "Password Reset Failed",
            "Not logged in.",
            sadIcon
          );
          this.toggleDisable();
          return;
        }
      });
    } else {
      this.ChangePasswordNotification(
        "Password Reset Failed",
        "Not logged in.",
        sadIcon
      );
      this.toggleDisable();
      return;
    }
    if (values.newpassword !== values.confirmpassword) {
      this.ChangePasswordNotification(
        "Password Reset Failed",
        "Password doesnt match",
        sadIcon
      );
      this.toggleDisable();
      return;
    }
    cognitoUser.changePassword(
      values.oldpassword,
      values.newpassword,
      (err, result) => {
        if (err) {
          this.ChangePasswordNotification(
            "Password Reset Failed",
            err.message,
            sadIcon
          );
          this.toggleDisable();
          return;
        }

        this.ChangePasswordNotification(
          "Password Reset Succesful",
          "You can start using your new password now",
          happyIcon
        );
        this.toggleDisable();
      }
    );
  };
  onFinishFailedResetPassword = (err) => {
    this.ChangePasswordNotification("Password Reset Failed HERE", err, sadIcon);
  };

  ChangePasswordNotification = (desc, msg, icon) => {
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
    let pageView = (
      <Form
        style={{ padding: "15px" }}
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onFinishResetPassword}
        onFinishFailed={this.onFinishFailedResetPassword}>
        <Form.Item
          label="Old Password"
          name="oldpassword"
          rules={[
            { required: true, message: "Please input your old password!" },
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newpassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmpassword"
          rules={[
            { required: true, message: "Please input your new password!" },
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

    return <div>{pageView}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.mr.counter,
    userpool: state.mr.UserPool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: (val) => dispatch(actionCreators.increment(val)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
