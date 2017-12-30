import React, { Component, PropTypes } from 'react';

import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';

class AuthRoot extends Component {
  render () {
    const { dispatch } = this.props;

    console.log(this.props.isAuthenticated);

    return (this.props.isAuthenticated) ? (
      <Redirect to={{
        pathname: '/dashboard',
        state: { from: this.props.location }
      }} />
    ) : (
      <Redirect to={{
        pathname: '/home',
        state: { from: this.props.location }
      }} />
    )
  }
};

AuthRoot.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state._auth.authenticated,
    token: state._auth.token
  };
};

export default connect(mapStateToProps)(AuthRoot);