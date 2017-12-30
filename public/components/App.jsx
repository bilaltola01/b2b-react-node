import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
  HashRouter as Router,
  Route
} from 'react-router-dom';

import * as actionCreators from '../action-creators';
import * as AuthService from './Auth/auth.service';

import AuthRoot from './AuthRoot';
import Dashboard from './Dashboard';
import Home from './Home';
import Profile from './Profile';
import Branches from './Branches';
import Branch from './Branch';
import MenusPage from './MenusPage';
import MenuPage from './MenuPage';
import TranslatePage from './TranslatePage';
import TranslationsPage from './TranslationsPage';
import TranslationPage from './TranslationPage';

import Page from './Page';
import PrivateRoute from './PrivateRoute';

let createHandlers = (dispatcher) => {
  let checkAuth = () => {
    dispatcher(actionCreators.getAuth());
  };

  return {
    checkAuth
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handlers = createHandlers(this.props.dispatch);
  }

  componentDidMount() {
    this.handlers.checkAuth();
  }

  render () {
    const { dispatch } = this.props;

    const AuthRootRenderer = () => {
      return (
        <AuthRoot dispatch={dispatch} />
      );
    };

    const HomeRenderer = () => {
      return (
        <Home dispatch={dispatch} />
      );
    };

    return (this.props.isAuthenticated !== undefined) ? (
      <Router>
        <div>
          <Route path="/" render={AuthRootRenderer} />
          <Route path="/home" render={HomeRenderer} />
          <Page>
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/profile/:action" component={Profile} />
            <PrivateRoute path="/branch/:action/:id" component={Branch} />
            <PrivateRoute path="/branches" component={Branches} />
            <PrivateRoute path="/translations" component={TranslationsPage} />
            <PrivateRoute path="/translation/:id" component={TranslationPage} />
            <PrivateRoute path="/translate/:component" component={TranslatePage} />
            <PrivateRoute path="/menus" component={MenusPage} />
            <PrivateRoute path="/menu/:action/:id" component={MenuPage} />
          </Page>
        </div>
      </Router>
    ) : ( <div>Placeholder div to replace by Loading component</div>)
  }
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state._auth.authenticated,
    token: state._auth.token
  };
};

export default connect(mapStateToProps)(App);

