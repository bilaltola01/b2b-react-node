import React, { Component, PropTypes } from 'react';

import Meal from './Meal';

class MenuCategory extends Component {
	render() {
		const { id, isCustom, title, description, meals } = this.props;

		const mealComponents = (meals && meals.length > 0) ? meals.map((meal, index) => {
			return <Meal id={meal.id} title={meal.title} description={meal.description} price={meal.price} enableDetails={meal.enableDetails} detail={meal.detail} key={index} />;
		}) : '';

		return (
			<div className="food-menu--part">
                <h4 className="food-menu--subtitle">{title}</h4>
                <div className="food-menu--separator"></div>
                <div className="food-menu--meal">
                	{mealComponents}
                </div>
            </div>
		)
	}
};

MenuCategory.propTypes = {
	id: PropTypes.number,
	isCustom: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	meals: PropTypes.array
};

export default MenuCategory;