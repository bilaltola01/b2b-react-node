import React, { Component, PropTypes } from 'react';

import MenuCategory from './MenuCategory';

class Menu extends Component {
	render() {
		const { id, title, ownProps } = this.props;

		console.log(this.props);

		const categoryComponents = (ownProps && ownProps.categories && ownProps.categories.length > 0) ? ownProps.categories.map((cat, index) => {
			const categoryDesc = (cat.Category) ? cat.Category.Description : cat.description;
			const categoryTitle = (cat.Category) ? cat.Category.Title : cat.title;
			return <MenuCategory 
				id={cat.MenuCategoryID || cat.catId} 
				isCustom={cat.IsCustom || cat.isCustom} 
				title={categoryTitle} 
				description={categoryDesc} 
				meals={cat.meals} 
				key={index} />;
		}) : null;

		return (
			<div className="content--container">
                <div className="food-menu">
	                {ownProps && ownProps.Title &&
	                    <h3 className="food-menu--title">{ownProps.Title}</h3>
	                }
                    {ownProps && ownProps.Description &&
	                    <p className="food-menu--description">{ownProps.Description}</p>
	                }

	                {ownProps && ownProps.Price && ownProps.Price > 0 &&
	                	<p className="food-menu--price">{ownProps.Price}</p>
	                }

	                {categoryComponents}

                </div>
            </div>
		)
	}
};

Menu.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	ownProps: PropTypes.object
};

export default Menu;