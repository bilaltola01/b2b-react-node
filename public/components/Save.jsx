import React, { Component, PropTypes } from 'react';

import { Redirect, Route } from 'react-router';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

let createHandlers = (ctx) => {
	let onMenuSaved = (obj) => {
		console.log('menu saved!');

		ctx.setState({
			isSaved: true,
			component: {
				type: 'menu',
				obj: obj
			}
		});
	};

	let onSave = (props) => {
		console.log('should save the object here');

		switch (props.type) {
			case 'menu':
				ctx.props.dispatch(actionCreators.saveMenu(props.component, onMenuSaved));
			default:

		}
	};

	return {
		onSave,
		onMenuSaved
	};
};

class Save extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSaved: false,
			component: {}
		};
		this.handlers = createHandlers(this);
	}

	componentDidMount() {

	}

	render() {
		const { type, component } = this.props;

		console.log(this.props);

		const saveComponent = (this.state.isSaved)
			? (
				<Redirect to={{
					pathname: '/translate/' + type,
					state: { component: this.state.component }
				}} />
			) : (
				<div className="profile-save">
	                <button id="menu-save" onClick={(e) => this.handlers.onSave(this.props)}>Save Menu Changes</button>
	            </div>
			);

		return saveComponent;
	}
};

Save.propTypes = {
	type: PropTypes.string,
	component: PropTypes.object
};

const mapStateToProps = (state) => {
	console.log(state);
	return {
		menu: state._menu.menu
	}
};

export default connect(mapStateToProps)(Save);