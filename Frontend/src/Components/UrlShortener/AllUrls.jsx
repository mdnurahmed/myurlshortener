import React, { Component } from "react";
import * as actionCreators from "../../store/actions/actions";
import axios from "axios";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Row, Col, Button as Butt, notification } from "antd";
import { DeleteTwoTone, SmileOutlined, MehOutlined } from "@ant-design/icons";

const happyIcon = <SmileOutlined style={{ color: "#108ee9" }} />;
const sadIcon = <MehOutlined style={{ color: "red" }} />;

class AllUrls extends Component {
  state = { disabled: false, loaded: false };
  componentDidMount() {
    if (this.props.datasource === null) {
      this.loadTable(true);
    }
  }
  loadTable = (forward) => {
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
      headers: { Authorization: token },
      params: {
        last_short_url: this.props.last_short_url,
        forward: forward,
      },
    };

    this.toggleDisable();
    axios
      .get(
        process.env.REACT_APP_BASE_URL + process.env.REACT_APP_ALLURLSAPI,
        config
      )
      .then((response) => {
        if (response.data.urls.length === 0) {
          this.toggleDisable();
          return;
        }
        if (response.data.error) {
          this.Notification(
            "Failed to fetch all short urls",
            response.data.error.message,
            sadIcon
          );
          this.toggleDisable();
          return;
        }

        let datasource = [];
        for (let i = 0; i < response.data.urls.length; i++) {
          datasource.push(response.data.urls[i]);
        }
        this.props.LoadDataSource(datasource, response.data.LastShortUrl);
        this.toggleDisable();
      })
      .catch((err) => {
        this.toggleDisable();
      });
  };

  delete = (index) => {
    this.toggleDisable();
    let token = "";
    const user = this.props.userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          this.toggleDisable();
          return;
        } else {
          token = session.getAccessToken().getJwtToken();
        }
      });
    } else {
      this.toggleDisable();

      return;
    }

    let config = {
      headers: {
        Authorization: token,
      },
      data: {
        short_url: this.props.datasource[index].short_url,
      },
    };
    axios
      .delete(
        process.env.REACT_APP_BASE_URL + process.env.REACT_APP_DELETEURLAPI,
        config
      )
      .then((response) => {
        this.toggleDisable();
        if (response.data.error) {
          this.Notification(
            "Delete Failed",
            response.data.error.message,
            sadIcon
          );
          return;
        }

        let datasource = [...this.props.datasource];
        datasource.splice(index, 1);
        let last_short_url = "";
        if (datasource.length > 0)
          last_short_url = datasource[datasource.length - 1].short_url;

        this.Notification(
          "Delete Successful",
          "Succesfully deleted the short url for : \n\n" +
            this.props.datasource[index].long_url,
          happyIcon
        );
        this.props.LoadDataSource(datasource, last_short_url);
      })
      .catch((err) => {
        this.toggleDisable();
        this.Notification(
          "Fetching all short urls failed",
          "Something Went Wrong",
          sadIcon
        );
      });
  };

  Notification = (desc, msg, icon) => {
    notification.open({
      message: desc,
      description: msg,
      duration: 0,
      icon: icon,
      onClick: () => {},
    });
  };

  toggleDisable = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };
  render() {
    let navigationButtons = null;
    let result = null;
    let msg = null;
    if (this.props.datasource != null && this.props.datasource.length === 0) {
      msg = <h1>Click Next Page button or Previous Page button to navigate</h1>;
    }
    if (this.props.datasource != null) {
      navigationButtons = (
        <Row style={{ padding: "10px 0px 10px 0px" }}>
          <Col className="gutter-row" span={3}>
            <Butt
              type="primary"
              disabled={this.state.disabled}
              onClick={() => this.loadTable(false)}
              style={{
                fontFamily: "Candara",
              }}>
              Previous Page
            </Butt>
          </Col>
          <Col className="gutter-row" span={3} offset={18}>
            <Butt
              type="primary"
              disabled={this.state.disabled}
              onClick={() => this.loadTable(true)}
              style={{
                fontFamily: "Candara",
              }}>
              Next Page
            </Butt>
          </Col>
        </Row>
      );
      result = (
        <TableContainer component={Paper}>
          <Table asize="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                    Short Urls
                  </h2>
                </TableCell>
                <TableCell align="right">
                  <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                    Long Urls
                  </h2>
                </TableCell>
                <TableCell align="right">
                  <h2 style={{ color: "#001a00", fontFamily: "Candara" }}>
                    Action
                  </h2>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.datasource.map((row, index) => (
                <TableRow key={row.short_url}>
                  <TableCell component="th" scope="row">
                    <a href={row.short_url}>{row.short_url}</a>
                  </TableCell>
                  {/* <TableCell align='right'>{row.short_url}</TableCell> */}
                  <TableCell align="right">
                    <a href={row.long_url}>{row.long_url}</a>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={this.state.disabled}
                      onClick={() => this.delete(index)}>
                      Delete <DeleteTwoTone />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return (
      <div>
        {navigationButtons}
        {msg}
        <Row>
          <Col span={24}>{result}</Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userpool: state.mr.UserPool,
    datasource: state.mr.datasource,
    last_short_url: state.mr.last_short_url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    LoadDataSource: (datasource, last_short_url) =>
      dispatch(actionCreators.loadDataSource(datasource, last_short_url)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllUrls);
