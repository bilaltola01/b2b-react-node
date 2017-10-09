import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Menu from './Menu';
import Save from './Save';

class AsidePreview extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//access to this.props.menu;
		console.log('in the preview aside ');
		console.log(this.props.menu);
	}

	render() {
		const { component, save } = this.props;

		console.log(this.props.menu);

		const menuComponent = (this.props.menu) ? (
			<Menu ownProps={this.props.menu} />
		) : null;

		const saveComponent = (this.props.menu && save) ? (
			<Save type="menu" component={this.props.menu} />
		) : null;

		return (
			<aside className="aside aside--preview">
	            <section className="aside--section contacts--excellence">
	                <h1 className="aside--title">Preview</h1>

	                {menuComponent}
	            </section>

	            {saveComponent}
	        </aside>
		)
	}
};

const mapStateToProps = (state) => {
	console.log(state);
	return {
		menu: state._menu.menu
	};
};

AsidePreview.propTypes = {
	component: PropTypes.object,
	save: PropTypes.bool
};

export default connect(mapStateToProps)(AsidePreview);