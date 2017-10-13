import React, { Component, PropTypes } from 'react';
import { Redirect, Route } from 'react-router';

import * as actionCreators from '../action-creators';

let createHandlers = (ctx) => {
	let onLogin = (e) => {
		e.preventDefault();
		ctx.props.dispatch(actionCreators.getAuth(ctx.getDataFromEvent(e), (res) => {
			if (res && res.authenticated) {
				ctx.setState({
					hasToRedirect: true
				});
			}
		}));
	};

	return {
		onLogin
	};
};

class LoginHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasToRedirect: false
		};
		this.handlers = createHandlers(this);
	}

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

		return (!this.state.hasToRedirect) ? (
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

			                <button id="button--login" className="button button--login-outline" onClick={this.handlers.onLogin}>Log In</button>
			            </form>
			            <a href="#," className="login--link">
			                Forgotten your details?
			            </a>
			        </div>
			    </div>
			</header>
		) : (
	    	<Redirect to={{
	        	pathname: '/dashboard',
	        	state: { from: this.props.location }
	    	}} />
	    );
	}
};

LoginHeader.propTypes = {
	dispatch: PropTypes.func.isRequired
};

export default LoginHeader;