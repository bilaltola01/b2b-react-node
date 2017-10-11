import React, { Component, PropTypes } from 'react';

import MealDetail from './MealDetail';

class Meal extends Component {
	render() {
		const { id, title, description, price, enableDetails, detail } = this.props;
		let detailComponents = '';

		if (Object.keys(detail).length > 0 && enableDetails) {
			detailComponents = <MealDetail id={detail.id} title={detail.title} description={detail.description} medias={detail.medias} />;
		}

		return (
			<div>
				<p className="food-menu--text">
	                {title}
	                <span className="food-menu--description">{description}</span>

	                {price && price > 0 &&
	                	<span className="food-meal--price">{price}</span>
	                }
	            </p>
	            {detailComponents}
            </div>
		)
	}
};

Meal.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.number,
	enableDetails: PropTypes.bool,
	detail: PropTypes.object
};

export default Meal;