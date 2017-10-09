import React, { Component, PropTypes } from 'react';

import * as DomUtils from '../shared/dom.utils';
const classNames = require('classnames');

import MealsEdit from './MealsEdit';
import LanguagePicker from './LanguagePicker';

let createHandlers = (ctx) => {
	let headerOnClick = () => {
    	ctx.setState((prevState) => {
			return {
				expanded: !prevState.expanded
			};
		});
  	};

  	let onCategoryRemove = (obj, fn) => {
		ctx.setState({
			removed: true
		});
		// actually remove that thing from the global store
		if (typeof fn === 'function') {
			fn(obj);
		}
	};

	let onAdd = (obj) => {
		ctx.setState((prevState) => {
			let cat = {
				oldId: prevState.category.id,
				id: obj.id,
				title: obj.name
			};
			// actually add that thing to the global store
			ctx.props.onChange(cat);

			return {
				category: cat
			};
		});
	};

	let onMealsChange = (obj) => {
		console.log(obj);
		let cat = {
			id: obj.id,
			title: obj.title,
			meals: obj.meals
		};

		ctx.props.onChange(cat);
	};

	let onPickerClick = (e) => {
		DomUtils.toggleClass(e.target, 'active');
	};

	let onPickerItemClick = (e) => {
		// Change UI
		let rel = e.target.getAttribute('rel');
		let text = e.target.textContent;
		//let id = parseInt(e.target.getAttribute('data-id'), 10);
		let id = ctx.props.totalCategories.find((cat) => {
			return cat.title === text;
		}).id;
		let target = e.target.parentNode.previousElementSibling;
		target.setAttribute('data-rel', rel);
		target.textContent = text;
		DomUtils.toggleClass(target, 'active');

		console.log(rel, text, id);

		// Then add the new language
		onAdd({
			id,
			rel,
			name: text
		});
	};

	return {
		headerOnClick,
		onCategoryRemove,
		onAdd,
		onMealsChange,
		onPickerClick,
		onPickerItemClick,
	};
};

class MenuCategoryEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			removed: false,
			expanded: true,
			category: {
				id: this.props.id,
				title: this.props.title
			}
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { id, isCustom, title, description, meals, totalCategories, onCategoryRemove, onChange } = this.props;
		const obj = {
			type: "categories",
			items: totalCategories
		};

		const classes = classNames(
			'branch--contact--header',
			'collapsable',
			(this.state.expanded) ? 'opened' : ''
		);

		const mealComponents = (
			<MealsEdit meals={meals} category={{id, title}} onChange={this.handlers.onMealsChange} />
		);

		return (
			<div className="food-menu--part">
				<div className="" onClick={(e) => this.handlers.onCategoryAdd({id}, onCategoryAdd)}>

				</div>
        		<h4>
        			Category n°{id}
        			<span className="status status--issue remove" onClick={(e) => this.handlers.onCategoryRemove({id}, onCategoryRemove)}></span>
        		</h4>
        		<div className="content--edit">
	        		<div id="menu-category-add" className="language--add">
						<label>Enter new Category Title:</label>
						<div id="language-picker" className="language--picker">
							<LanguagePicker data={obj} onAdd={this.handlers.onAdd} onPickerClick={this.handlers.onPickerClick} onPickerItemClick={this.handlers.onPickerItemClick} />
	                    </div>
					</div>
        		</div>
        		<div className="food-menu-meals">
        			<div className="branch--contact aside--section contacts--support">
						<header className={classes} onClick={this.handlers.headerOnClick}>
							<div className="header--title-container">
								<h1 className="aside--title collapsable--title">
									Meals ({this.state.category.title})
								</h1>
							</div>
						</header>
						<div className="global-padding-wrapper">
							<div className="food-menu--meal">
			                	{mealComponents}
			                </div>
						</div>
					</div>
                </div>
            </div>
		)
	}
};

MenuCategoryEdit.propTypes = {
	id: PropTypes.number,
	isCustom: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	meals: PropTypes.array,
	totalCategories: PropTypes.array,
	onCategoryRemove: PropTypes.func,
	onChange: PropTypes.func
};

export default MenuCategoryEdit;