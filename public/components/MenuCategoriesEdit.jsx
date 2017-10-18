import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import MenuCategoryEdit from './MenuCategoryEdit';

let createHandlers = (ctx) => {
	let lastSelectedCategory = 1;
	let totalCategories = (ctx.props && ctx.props.availableCategories) ? ctx.props.availableCategories : [];
	let onCategoryRemove = (obj) => {
		console.log(obj);
		let categories;
		ctx.setState((prevState) => {
			categories = prevState.allCategories.reduce((acc, current) => {
				return (current.id !== obj.id) ? acc.concat([current]) : acc;
			}, []);

			console.log(prevState.allCategories);

			console.log(categories);
			ctx.props.onChange('categories', {data: categories});

			return {
				allCategories: categories
			}
		});
	};

	let onCategoryChange = (cat) => {
		console.log(cat);
		let categories;
		ctx.setState((prevState) => {
			console.log(prevState.allCategories);

			categories = prevState.allCategories.map((prevCategory, index) => {
				console.log(prevCategory);

				if (prevCategory.id === cat.id ||
					prevCategory.id === 1 /*&& prevState.allCategories.length === 1*/ ||
					(cat.oldId && prevCategory.id === cat.oldId)) {
					let obj = prevCategory;
					obj.title = cat.title;
					obj.id = cat.id;

					if (cat.meals && cat.meals.length > 0) {
						obj.meals = cat.meals;
					}

					console.log(obj);
					return obj;
				}

				return prevCategory;
			});

			lastSelectedCategory = cat.id;

			console.log(categories);
			ctx.props.onChange('categories', {data: categories});

			return {
				allCategories: categories
			}
		});
	};

	let onCategoryAdd = (obj) => {
		console.log(obj);
		let categories;
		ctx.setState((prevState) => {
			categories = prevState.allCategories;
			lastSelectedCategory = 1;

			/*
			if (prevState.allCategories.length > 0) {
				nextID = parseInt(prevState.allCategories[prevState.allCategories.length - 1].id, 10) + 1;
			}
			*/

			let finalObj = {
				id: lastSelectedCategory,
				isCustom: false,
				title: "",
				description: "",
				meals: [],
				totalCategories: totalCategories,
				onCategoryRemove: onCategoryRemove,
				onChange: ctx.props.onChange
			};

			console.log(finalObj);

			categories.push(finalObj);
			console.log(categories);
			ctx.props.onChange('categories', {data: categories});

			return {
				allCategories: categories
			}
		});
	};

	let getAvailableCategories = (type) => {
        ctx.props.dispatch(actionCreators.getCategories(type));
    };

	return {
		onCategoryRemove,
		onCategoryAdd,
		onCategoryChange,
		getAvailableCategories
	};
};

class MenuCategoriesEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCategories: []
		};
		this.handlers = createHandlers(this);
	}

	componentDidMount() {
        this.handlers.getAvailableCategories('standard');
    }

	render() {
		const { categories, onChange } = this.props;

		const totalCategories = (this.props && this.props.availableCategories) ? this.props.availableCategories : [];

		console.log(totalCategories);

		const categoriesComponent = (this.state.allCategories && this.state.allCategories.length > 0) ? this.state.allCategories.map((category, index) => {
			return <MenuCategoryEdit id={category.CategoryStandardID} totalCategories={totalCategories} isCustom={false} title={category.Title} description={category.Description} meals={category.meals || []} onChange={this.handlers.onCategoryChange} onCategoryRemove={this.handlers.onCategoryRemove} key={index} />;
		}) : null;

		return (
			<div>
				<h3 className="asset--title">Categories</h3>

                {categoriesComponent}
                <div className="branch--add category--add">
                	<div onClick={(e) => this.handlers.onCategoryAdd()}>
						<div className="add-item dashed">
							<span>Add a Category <strong>+</strong></span>
						</div>
					</div>
                </div>
            </div>
		)
	}
};

MenuCategoriesEdit.propTypes = {
	categories: PropTypes.array,
	onChange: PropTypes.func
};


const mapStateToProps = (state) => {
	console.log(state);
  return {
    availableCategories: state._categories.categories
  };
};

export default connect(mapStateToProps)(MenuCategoriesEdit);