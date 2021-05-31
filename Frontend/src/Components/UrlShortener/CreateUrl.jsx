import React, { Component } from "react";
import { Input, Table, notification } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";

import { SmileOutlined, MehOutlined } from "@ant-design/icons";

const happyIcon = <SmileOutlined style={{ color: "#108ee9" }} />;
const sadIcon = <MehOutlined style={{ color: "red" }} />;

const columns = [
  {
    title: "Short Url",
    dataIndex: "Short Url",
    key: "Short Url",
    render: (text) => <a href={text}>{text}</a>,
  },
  {
    title: "Long Url",
    dataIndex: "Long Url",
    key: "Long Url",
    width: "12%",
    render: (text) => <a href={text}>{text}</a>,
  },
];

class CreateUrl extends Component {
  state = {
    loading: false,
    datasource: null,
  };
  onSearch = (value) => {
    this.toggleLoading();

    let token = "";
    const user = this.props.userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          return;
        } else {
          token = session.getAccessToken().getJwtToken();
        }
      });
    } else {
      return;
    }

    let config = {
      headers: {
        Authorization: token,
      },
    };

    const data = {
      long_url: value,
    };

    axios
      .post(
        process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREATEURLAPI,
        data,
        config
      )
      .then((response) => {
        if (response.data.error) {
          this.CreateUrlNotification(
            "Short url creation failed",
            response.data.error.message,
            sadIcon
          );
          this.toggleLoading();
          return;
        }
        this.CreateUrlNotification(
          "Short url creation successful",
          "You can start using the short url now",
          happyIcon
        );
        this.setState({
          loading: false,
          datasource: [
            {
              key: "2",
              "Short Url": response.data.short_url,
              "Long Url": response.data.long_url,
            },
          ],
        });
      })
      .catch((err) => {
        this.toggleLoading();
        this.CreateUrlNotification(
          "Short url creation failed",
          "Something went wrong",
          sadIcon
        );
      });
  };

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };
  CreateUrlNotification = (desc, msg, icon) => {
    notification.open({
      message: desc,
      description: msg,
      duration: 0,
      icon: icon,
    });
  };
  render() {
    let result = null;
    if (this.state.datasource != null) {
      result = (
        <Table
          dataSource={this.state.datasource}
          columns={columns}
          pagination={false}
          style={{ padding: "20px", color: "#108ee9" }}
          bordered
        />
      );
    }
    return (
      <div>
        <Input.Search
          placeholder="Paste the long url here"
          size="large"
          loading={this.state.loading}
          style={{ padding: "30px" }}
          onSearch={this.onSearch}
        />
        {result};
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUrl);
