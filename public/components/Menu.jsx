import React, { Component, PropTypes } from 'react';

import MenuCategory from './MenuCategory';

class Menu extends Component {
	render() {
		const { id, title, ownProps } = this.props;
		const categoryComponents = (ownProps && ownProps.categories && ownProps.categories.length > 0) ? ownProps.categories.map((cat, index) => {
			return <MenuCategory 
				id={cat.id} 
				isCustom={cat.isCustom} 
				title={cat.title} 
				description={cat.description} 
				meals={cat.meals} 
				key={index} />;
		}) : null;

		return (
			<div className="content--container">
                <div className="food-menu">
	                {ownProps && ownProps.title &&
	                    <h3 className="food-menu--title">{ownProps.title}</h3>
	                }
                    {ownProps && ownProps.description &&
	                    <p className="food-menu--description">{ownProps.description}</p>
	                }

	                {ownProps && ownProps.price &&
	                	<p className="food-menu--price">{ownProps.price}</p>
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