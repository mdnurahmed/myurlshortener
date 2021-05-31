import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import CoverPage from "./Coverpage/CoverPage";
import UrlShortener from "./UrlShortener/UrlShortener";
class Main extends Component {
  render() {
    return (
      <div>
        <Route path="/" exact component={CoverPage} />
        <Route path="/url-shortener" component={UrlShortener} />
      </div>
    );
  }
}

export default connect(null, null)(Main);
