import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";
import { Alert, Menu } from "antd";
import {
  MailOutlined,
  DeliveredProcedureOutlined,
  SafetyOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import SignUp from "./SignUp";
import Login from "./Login";
import ConfirmEmail from "./ConfirmEmail";
import ForgotPassword from "./ForgotPassword";
class CoverPage extends Component {
  state = {
    // login_page: false,
    // signup_page: false,
    page: 1,
    current: "login",
  };
  componentDidMount() {
    this.initComponent();
  }
  componentDidUpdate() {
    this.initComponent();
  }
  initComponent = () => {
    this.props.CheckIfLoggedIn(this.props.userpool);
    if (this.props.logged_in) {
      this.props.history.push("/url-shortener");
    }
  };
  signUp = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 2;
    this.setState({
      page: newState.page,
    });
  };

  login = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 1;
    this.setState({
      page: newState.page,
    });
  };

  confirmEmail = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 3;
    this.setState({
      page: newState.page,
    });
  };

  forgotPass = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 4;
    this.setState({
      page: newState.page,
    });
  };

  onFinish = (values) => {};

  onFinishFailed = (errorInfo) => {};
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };
  render() {
    let pageView = <Login />,
      alert = <Alert message="You are not logged in" type="error" showIcon />;
    if (this.state.page === 2) {
      pageView = <SignUp />;
    } else if (this.state.page === 3) {
      pageView = <ConfirmEmail />;
    } else if (this.state.page === 4) {
      pageView = <ForgotPassword />;
    }
    if (this.props.logged_in === true) {
      alert = (
        <Alert message="You are already logged in" type="success" showIcon />
      );
    }
    return (
      <div>
        <Menu
          mode="horizontal"
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}>
          <Menu.Item
            key="login"
            icon={<DeliveredProcedureOutlined />}
            onClick={this.login}>
            Login
          </Menu.Item>
          <Menu.Item
            key="signup"
            icon={<SafetyOutlined />}
            onClick={this.signUp}>
            Sign Up
          </Menu.Item>
          <Menu.Item
            key="confirm"
            icon={<MailOutlined />}
            onClick={this.confirmEmail}>
            Confirm Email
          </Menu.Item>
          <Menu.Item
            key="forgot"
            icon={<QuestionCircleOutlined />}
            onClick={this.forgotPass}>
            Forgot Password
          </Menu.Item>
        </Menu>
        {alert}
        {pageView}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged_in: state.mr.logged_in,
    userpool: state.mr.UserPool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    Login: () => dispatch(actionCreators.login()),
    CheckIfLoggedIn: (userpool) =>
      dispatch(actionCreators.checkIfLoggedIn(userpool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverPage);
