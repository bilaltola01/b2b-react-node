import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Menu from './Menu';
import Translation from './Translation';
import BranchLanguagesEdit from './BranchLanguagesEdit';
import MenuCategoriesEdit from './MenuCategoriesEdit';

let createHandlers = (ctx) => {
	let onImageUpload = () => {
		console.log('uploaded image!!');
	};

	let onSaveChanges = () => {

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

	let getMenu = (data) => {
    	ctx.props.dispatch(actionCreators.getMenu(data));
  	};

	return {
		onImageUpload,
		onSaveChanges,
		onChanges,
		getMenu
	};
};

class SectionArticleEditMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
		this.handlers = createHandlers(this);
	}

	componentDidMount() {
		this.handlers.getMenu(this.props);
	}

	render() {
		const {
			id,
			title,
			description,
			price,
			categories,
			languages,
			translations,
			currency
		} = this.props;

		console.log(this.props);

		let languagesList = (translations && translations.length > 0) ? translations.map((translation, index) => {
			return (index < translations.length - 1)
				? (
					<span className="language--name" key={index}>
						<span>{translation.BranchLanguageName}</span>
						,&nbsp;
					</span>
				) : (
					<span className="language--name" key={index}>
						<span>{translation.BranchLanguageName}</span>
					</span>
				);
		}) : null;

		let translationsContainer = (translations && translations.length > 0) ?
			<div>
				<header className="article--menu--translations--header">
					<p className="menu--title">
						Translations
					</p>
					<div>
						<div className="content--label">
							<h3 className="label--key">Total:</h3>
							<span className="label--value">{translations.length}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Languages:</h3>
							<span className="label--value">{languagesList}</span>
						</div>
					</div>
				</header>
				<Link to="/translations" >
					<button className="button--action button--action-filled">See translations</button>
				</Link>
			</div>
		: null;


		const menuLanguages = (languages && languages.length > 0) ? (
			<BranchLanguagesEdit languages={languages} onChange={this.handlers.onChanges} />
		) : null;

		const menuCategories = (categories && categories.length > 0) ? (
			<MenuCategoriesEdit categories={categories} onChange={this.handlers.onChanges} />
		) : null;

		return (
			<div>
	            <div className="content--container global-padding-wrapper">
	                <h2 className="asset--title">
	                    Content
	                </h2>
	            </div>

	            <div className="content--container global-padding-wrapper no-border-top">
	                <form id="form-menu-content" className="content--edit">
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Title:</label>
	                        <input className="input--edit" type="text" name="menu--price" id="menu-title" defaultValue={title} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'title'})} />
	                    </div>
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Description:</label>
	                        <input className="input--edit" type="text" name="menu--description" id="menu-description" defaultValue={description} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'description'})} />
	                    </div>
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Price:</label>
	                        <input className="input--edit" type="text" name="menu--price" id="menu-price" defaultValue={price} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'price'})} />
	                    </div>
	                </form>

	                <div className="menu--languages">
		                {menuLanguages}
		            </div>

		            <div className="menu--categories">
		                {menuCategories}
		            </div>
	            </div>
			</div>
		)
	}
};

SectionArticleEditMenu.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.number,
	categories: PropTypes.array,
	languages: PropTypes.array,
	translations: PropTypes.array,
	currency: PropTypes.object
};

const mapStateToProps = (state) => {
	console.log(state);
  return {
    menu: state._menu.menu
  };
};

export default connect(mapStateToProps)(SectionArticleEditMenu);
