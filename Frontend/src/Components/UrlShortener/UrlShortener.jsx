import React, { Component } from "react";
import AllUrls from "./AllUrls";
import CreateUrl from "./CreateUrl";
import ChangePassword from "./ChangePassword";
import { Typography, Divider, Alert, Menu, Modal } from "antd";
import {
  AppstoreOutlined,
  LoginOutlined,
  BulbTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";

class UrlShortener extends Component {
  state = {
    page: 1,
    current: "create",
    visible: false,
  };
  componentDidMount() {
    this.initComponent();
  }
  componentDidUpdate() {
    this.initComponent();
  }
  initComponent = () => {
    this.props.CheckIfLoggedIn(this.props.userpool);
    if (this.props.logged_in === false) {
      this.props.history.push("/");
    }
  };
  createUrl = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 1;
    this.setState({
      page: newState.page,
    });
  };

  getUrls = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 2;
    this.setState({
      page: newState.page,
    });
  };
  changePassword = () => {
    const newState = Object.assign({}, this.state);
    newState.page = 3;
    this.setState({
      page: newState.page,
    });
  };
  modal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  logout = () => {
    const user = this.props.userpool.getCurrentUser();
    if (user) {
      user.signOut();
      this.props.Logout();
    }
  };
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };
  render() {
    let pageView = <CreateUrl />,
      alert = <Alert message="You are not logged in" type="error" showIcon />;
    if (this.state.page === 2) {
      pageView = <AllUrls />;
    } else if (this.state.page === 3) {
      pageView = <ChangePassword />;
    }
    if (this.props.logged_in === true) {
      alert = <div></div>;
    }
    return (
      <div>
        <Divider>
          <Typography>
            <Typography.Title
              style={{ color: "#108ee9", fontFamily: "Candara" }}>
              MY URL SHORTENER
            </Typography.Title>
          </Typography>
        </Divider>
        <Menu
          mode="horizontal"
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}>
          <Menu.Item
            key="create"
            icon={<AppstoreOutlined />}
            onClick={this.createUrl}>
            Create Short Url
          </Menu.Item>
          <Menu.Item
            key="allurls"
            icon={<BulbTwoTone />}
            onClick={this.getUrls}>
            All My Short Urls
          </Menu.Item>
          <Menu.Item
            key="changepassword"
            icon={<InfoCircleOutlined />}
            onClick={this.changePassword}>
            Change Password
          </Menu.Item>
          <Menu.Item key="logout" icon={<LoginOutlined />} onClick={this.modal}>
            Logout
          </Menu.Item>
        </Menu>
        {alert}
        {pageView}
        <Modal
          title="Confirm Logout"
          visible={this.state.visible}
          onOk={this.logout}
          onCancel={this.modal}
          okText="Yes,Log Me Out"
          cancelText="No">
          <p>Are You Sure You Want To Log Out?</p>
        </Modal>
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
    CheckIfLoggedIn: (userpool) =>
      dispatch(actionCreators.checkIfLoggedIn(userpool)),
    Logout: () => dispatch(actionCreators.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlShortener);
