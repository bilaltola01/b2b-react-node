import React, { Component, PropTypes } from 'react';

import MenuCategoryEdit from './MenuCategoryEdit';

let createHandlers = (ctx) => {
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
				if (prevCategory.id === cat.oldId) {
					let obj = prevCategory;
					obj.title = cat.title;
					obj.id = cat.id;
					if (cat.meals) {
						obj.meals = cat.meals;
					}

					console.log(obj);
					return obj;
				}

				return prevCategory;
			});

			console.log(categories);
			ctx.props.onChange('categories', {data: categories});

			return {
				allCategories: categories
			}
		});
	};

	let onCategoryAdd = (obj) => {
		let categories;
		ctx.setState((prevState) => {
			categories = prevState.allCategories;
			let nextID = 1;

			if (prevState.allCategories.length > 0) {
				nextID = parseInt(prevState.allCategories[prevState.allCategories.length - 1].id, 10) + 1;
			}

			let obj = {
				id: nextID,
				isCustom: false,
				title: "",
				description: "",
				meals: [],
				totalCategories: ctx.totalCategories,
				onCategoryRemove: onCategoryRemove,
				onChange: ctx.props.onChange
			};

			console.log(obj);

			categories.push(obj);
			console.log(categories);
			ctx.props.onChange('categories', {data: categories});

			return {
				allCategories: categories
			}
		});
	}

	return {
		onCategoryRemove,
		onCategoryAdd,
		onCategoryChange
	};
};

class MenuCategoriesEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCategories: props.categories
		};
		this.handlers = createHandlers(this);
		this.totalCategories = [
			{
				id: 2,
                isCustom: false,
                title: "Starters",
                description: "First meal of the menu"
            },
            {
				id: 3,
                isCustom: false,
                title: "Mains",
                description: "Main meal of the menu"
            },
            {
				id: 4,
                isCustom: false,
                title: "Desserts",
                description: "Last meal of the menu"
            },
            {
				id: 5,
                isCustom: false,
                title: "Sides",
                description: "Extra munchies for the hungriest!"
            },
            {
				id: 6,
                isCustom: false,
                title: "Appetizers",
                description: "Some 'amuse-gueules' to titillate your stomach!"
            },
            {
				id: 1,
                isCustom: false,
                title: "Beverages",
                description: "Cold and hot drinks"
            },
		];
	}

	render() {
		const { categories, onChange } = this.props;

		const categoriesComponent = (this.state.allCategories.length > 0) ? this.state.allCategories.map((category, index) => {
			return <MenuCategoryEdit id={category.id} totalCategories={this.totalCategories} isCustom={category.isCustom} title={category.title} description={category.description} meals={category.meals} onChange={this.handlers.onCategoryChange} onCategoryRemove={this.handlers.onCategoryRemove} key={index} />;
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

export default MenuCategoriesEdit;