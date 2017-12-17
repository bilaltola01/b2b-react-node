import React, { Component, PropTypes } from 'react';

import LoginHeader from './LoginHeader';
import LoginContent from './LoginContent';

class Home extends Component {
  render () {
    const { dispatch } = this.props;

    const images = [];

    return (
      <div className="global-container layout--login">
        <header id="header" className="header--small">
          <a className="main-logo" href="#,">
            <img src="assets/images/logo-one-menu-white.svg" alt="ONE-MENU Logo" />
          </a>
        </header>

        <main id="main" className="main clearfix">
          <div className="giant-image">
            <div className="overlay overlay--yellow"></div>
            <img src="assets/images/img-giant-image-2.jpg" alt="One Menu Restaurant" />
          </div>

          <div className="portal--desc">
              <LoginHeader dispatch={dispatch} />
          </div>
        </main>
        <div className="footer-nav">
            <ul>
              <li><a className="one-menu" href="http://one-menu.com">one-menu.com</a></li>
              <li><a href="mailto:contact@one-menu.com">contact@one-menu.com</a></li>
            </ul>
          </div>
      </div>
    )
  }
};

Home.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default Home;
