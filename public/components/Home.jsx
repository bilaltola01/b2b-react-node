import React, { Component, PropTypes } from 'react';

import LoginHeader from './LoginHeader';
import LoginContent from './LoginContent';

class Home extends Component {
  render () {
    const { dispatch } = this.props;

    const images = [
      {
        id: 1,
        path: "http://placekitten.com/640/480",
        altDesc: "Image of a Wonderful Kitty"
      },
      {
        id: 2,
        path: "http://placekitten.com/420/280",
        altDesc: "Image of a Wonderful Kitty"
      },
      {
        id: 3,
        path: "http://placekitten.com/320/480",
        altDesc: "Image of a Wonderful Kitty"
      }
    ];

    return (
      <div id="global-container" className="global-container layout--login">
        <LoginHeader dispatch={dispatch} />
        <LoginContent images={images} />
      </div>
    )
  }
};

Home.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default Home;
