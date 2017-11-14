import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import MenuCategoriesEdit from './MenuCategoriesEdit';
import BranchLanguagesEdit from './BranchLanguagesEdit';
import MenuBranchesEdit from './MenuBranchesEdit';

let createHandlers = (ctx) => {
	let onSaveMenu = () => {

	};

	let onChanges = (type, obj) => {
		let dataToUpdate = {};
		switch (type) {
			case 'main':
				dataToUpdate[obj.key] = obj.target.target.value;

				ctx.props.dispatch(actionCreators.setMenu(ctx.props.menu, dataToUpdate));
			default:
				dataToUpdate[type] = obj.data;

				console.log(obj);
				console.log(dataToUpdate);
				ctx.props.dispatch(actionCreators.setMenu(ctx.props.menu, dataToUpdate));

		}
	};

	return {
		onSaveMenu,
		onChanges
	};
};

class SectionArticleAddMenu extends Component {
	constructor(props) {
		super(props);
		this.handlers = createHandlers(this);
	}

	render() {
		const {
			title,
			component
		} = this.props;

		let categories = [];
		let languages = [];
		let branches = [];

		console.log(this.props);

		const profileBranches = this.props.profile.branches;

		const menuBranches = (
			<MenuBranchesEdit branches={branches} onChange={this.handlers.onChanges} />
		);

		const menuLanguages = (
			<BranchLanguagesEdit languages={languages} onChange={this.handlers.onChanges} />
		);

		const menuCategories = (
			<MenuCategoriesEdit categories={categories} onChange={this.handlers.onChanges} />
		);

		const addMenuComponent = (profileBranches && profileBranches.length > 0) ? (
			<div className="content--container global-padding-wrapper no-border-top">
                <form id="form-menu-content" className="content--edit">
                    <div className="edit--block">
                        <label className="label--edit">Enter new Title:</label>
                        <input className="input--edit" type="text" name="menu--price" id="menu-title" defaultValue={"New title..."} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'title'})} />
                    </div>
                    <div className="edit--block">
                        <label className="label--edit">Enter new Description:</label>
                        <input className="input--edit" type="text" name="menu--description" id="menu-description" defaultValue={"New description..."} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'description'})} />
                    </div>
                    <div className="edit--block">
                        <label className="label--edit">Enter new Price:</label>
                        <input className="input--edit" type="text" name="menu--price" id="menu-price" defaultValue={"New price..."} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'price'})} />
                    </div>
                </form>

                <div className="menu--languages">
	                {menuBranches}
	            </div>

                <div className="menu--languages">
	                {menuLanguages}
	            </div>

	            <div className="menu--categories">
	                {menuCategories}
	            </div>
            </div>
		) : (
			<div className="global-padding-wrapper branches-container">
				<h2 className="no-items--headline">It looks like you have not entered any branches yet. You must add a branch first before entering any menus.</h2>
				<div className="branch--add">
	            	<Link to="/branch/add/1" >
						<div className="add-item dashed">
							<span>Add a Branch <strong>+</strong></span>
						</div>
					</Link>
	            </div>
            </div>
		);

		return (
			<div>
	            <div className="content--container global-padding-wrapper">
	                <h2 className="asset--title">
	                    Content
	                </h2>
	            </div>

	            {addMenuComponent}
			</div>
		)
	}
};

SectionArticleAddMenu.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
	component: PropTypes.object
};

const mapStateToProps = (state) => {
	console.log(state);
  return {
    menu: state._menu.menu
  };
};

export default connect(mapStateToProps)(SectionArticleAddMenu);