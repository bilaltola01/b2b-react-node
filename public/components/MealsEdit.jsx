import React, { Component, PropTypes } from 'react';

import MealEdit from './MealEdit';

let createHandlers = (ctx) => {
	let onAdd = () => {
		ctx.setState((prevState) => {
			let meals = prevState.allMeals;

			let obj = {
				id: ctx.props.category.id,
				title: "",
				description: "",
				price: null,
				enableDetails: false,
				detail: {},
				onRemove: onRemove
			};

			console.log(obj);

			meals.push(obj);

			ctx.props.onChange({
				id: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	let onChange = (obj) => {
		ctx.setState((prevState) => {
			let meals = prevState.allMeals.map((meal) => {
				if (meal.id === obj.id) {
					let tmp = meal;
					tmp.title = obj.title;
					tmp.description = obj.description;
					tmp.price = parseFloat(obj.price) || null;
					return tmp;
				}

				return meal;
			}, []);

			console.log(prevState.allMeals);

			console.log(meals);

			console.log(ctx.props.category.title);

			ctx.props.onChange({
				id: ctx.props.category.id,
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
				id: ctx.props.category.id,
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
			allMeals: props.meals
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { meals, onChange, category } = this.props;

		const mealComponents = (this.state.allMeals.length > 0) ? this.state.allMeals.map((meal, index) => {
			return <MealEdit id={meal.id} title={meal.title} description={meal.description} price={meal.price} enableDetails={meal.enableDetails} detail={meal.detail} key={meal.id} onChange={this.handlers.onChange} onRemove={this.handlers.onRemove} />;
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
