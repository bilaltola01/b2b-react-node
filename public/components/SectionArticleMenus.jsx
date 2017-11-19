import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import SectionArticleMenu from './SectionArticleMenu';

class SectionArticleMenus extends Component {
	render() {
		const { title, dateUpdate, component } = this.props;

		const currencies = (component.props.currencies && component.props.currencies.length > 0) ? component.props.currencies : [];

		console.log(component.props);

		const menuComponents = (component.props.menus && component.props.menus.length > 0) ? component.props.menus.map((menu, index) => {
			return <SectionArticleMenu 
				id={menu.MenuID || menu.id}
				title={menu.Title || menu.title}
				description={menu.Description || menu.description}
				price={menu.Price || menu.price}
				dateUpdate={menu.dateUpdate}
				categories={menu.categories}
				currencies={currencies}
				languages={menu.languages}
				translations={menu.translations}
				key={index} />;
		}) : null;

		const noItemsComponent = (!menuComponents || menuComponents.length <= 0) ? (
			<h2 className="no-items--headline">Oh no! It looks like you have not entered any menus yet.</h2>
		) : null;

		return (
			<article className="content--module module--item-details no-metadata content--menus">
				<div className="content--container global-padding-wrapper branches-container">
					<h2 className="asset--subtitle">
                        {title}
                    </h2>
                    <div className="branch--add">
                    	{noItemsComponent}
                    	<Link to="/menu/add/1" >
							<div className="add-item dashed">
								<span>Add a Menu <strong>+</strong></span>
							</div>
						</Link>
                    </div>
                    <div className="branches menus">
                    	{menuComponents}
                    </div>
                    <div className="branch--see-all">
                    	<Link to="/menus" >
							<button className="button--action button--action-filled">See all menus</button>
						</Link>
                    </div>
                </div>
			</article>
		)
	}
};

SectionArticleMenus.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default SectionArticleMenus;