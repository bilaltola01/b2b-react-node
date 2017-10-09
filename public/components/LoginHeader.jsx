import React, { Component, PropTypes } from 'react';

// We use the same ES6 import trick to get all action creators and produce a hash like we did with
// our reducers. If you haven't yet, go get a look at our action creator (./action-creators.js).
import * as actionCreators from '../action-creators';

class LoginHeader extends Component {
	getDataFromEvent(e) {
		e.preventDefault();

		let formData = new FormData(e.target.parentNode);
		let obj = {};

		for (let pair of formData.entries()) {
		   obj[pair[0]] = pair[1];
		}

		return {
			auth: obj
		};
	}

	render () {
		const { dispatch, token, isAuthenticated, completed } = this.props;

		return (
			<header id="header" className="header">
			    <div className="layout--header-wrapper vertical-container">
			        <div className="vertically-centered">
			            <h1 className="login--title">
			                <img style={{width: "100%"}} src="assets/images/logo-cafe-med-white.png" alt="The Cafe Mediterranean Logo" /><br />
			                Management Portal
			            </h1>

			            <form id="login-form" className="login--form" action="#">
			                <p className="login--input">
			                    <label className="login--label label--username" htmlFor="login--username">Username</label>
			                    <input type="text" name="Email" id="login--username" className="input--underline" placeholder="Username" />
			                </p>
			                <p className="login--input">
			                    <label className="login--label label--password" htmlFor="login--password">Password</label>
			                    <input type="password" name="Pwd" id="login--password" className="input--underline" placeholder="Password" />
			                </p>

			                <button id="button--login" className="button button--login-outline" onClick={(e) => dispatch(actionCreators.getAuth(this.getDataFromEvent(e)))}>Log In</button>
			            </form>
			            <a href="#," className="login--link">
			                Forgotten your details?
			            </a>
			        </div>
			    </div>
			</header>
		);
	}
};

LoginHeader.propTypes = {
	dispatch: PropTypes.func.isRequired
};

export default LoginHeader;