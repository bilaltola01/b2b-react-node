import React, { Component, PropTypes } from 'react';

import MealEdit from './MealEdit';

let createHandlers = (ctx) => {
	let lastSelectedMeal = 1;
	let onAdd = () => {
		ctx.setState((prevState) => {
			console.log(prevState.allMeals);
			let meals = prevState.allMeals;

			/*
			if (prevState.allMeals.length > 0) {
				nextID = parseInt(prevState.allMeals[prevState.allMeals.length - 1].id, 10) + 1;
			}
			*/


			let obj = {
				id: lastSelectedMeal,
				catId: ctx.props.category.id,
				title: "",
				description: "",
				price: null,
				enableDetails: false,
				detail: {},
				onRemove: onRemove
			};

			lastSelectedMeal++;

			console.log(obj);

			meals.push(obj);

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	let onChange = (obj) => {
		console.log(obj);
		ctx.setState((prevState) => {
			console.log(prevState.allMeals);

			//ctx.props.category.id === obj.catId

			let meals = prevState.allMeals.map((meal) => {
				if ((ctx.props.category.id === obj.catId && meal.id === obj.id)
					|| (meal.id === 1 && prevState.allMeals.length === 1)) {
					let tmp = meal;
					tmp.id = obj.id;
					tmp.catId = obj.catId;
					tmp.title = obj.title;
					tmp.description = obj.description;
					tmp.price = parseFloat(obj.price) || null;
					return tmp;
				}
				/*
				if (meal.id === obj.id || meal.id === 1) {
					let tmp = meal;
					tmp.title = obj.title;
					tmp.description = obj.description;
					tmp.price = parseFloat(obj.price) || null;
					return tmp;
				}
				*/

				return meal;
			}, []);

			console.log(prevState.allMeals);

			console.log(meals);

			console.log(ctx.props.category.title);

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	let onRemove = (obj) => {
		ctx.setState((prevState) => {
			let meals = prevState.allMeals.reduce((acc, current) => {
				return (current.id !== obj.id) ? acc.concat([current]) : acc;
			}, []);

			console.log(prevState.allMeals);

			console.log(meals);

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	return {
		onAdd,
		onRemove,
		onChange
	};
};

class MealsEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allMeals: []
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { meals, onChange, category } = this.props;

		console.log(category);

		const mealComponents = (this.state.allMeals && this.state.allMeals.length > 0) ? this.state.allMeals.map((meal, index) => {
			return <MealEdit id={meal.id} catId={category.id} title={meal.title} description={meal.description} price={meal.price} enableDetails={meal.enableDetails} detail={meal.detail} key={index} onChange={this.handlers.onChange} onRemove={this.handlers.onRemove} />;
		}) : null;

		return (
			<div>
				{mealComponents}
				<div className="branch--add meal--add">
                	<div onClick={(e) => this.handlers.onAdd()}>
						<div className="add-item dashed">
							<span>Add a Meal <strong>+</strong></span>
						</div>
					</div>
                </div>
			</div>
		);
	}
};

MealsEdit.propTypes = {
	meals: PropTypes.array,
	onChange: PropTypes.func,
	category: PropTypes.object
};

export default MealsEdit;
