import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import SectionArticleMenu from './SectionArticleMenu';

class SectionArticleMenus extends Component {
	render() {
		const { title, dateUpdate, component } = this.props;

		console.log(component.props);

		const menuComponents = (component.props.menus && component.props.menus.length > 0) ? component.props.menus.map((menu, index) => {
			return <SectionArticleMenu 
				id={menu.id}
				title={menu.title}
				description={menu.description}
				price={menu.price}
				dateUpdate={menu.dateUpdate}
				categories={menu.categories}
				currency={menu.currency}
				languages={menu.languages}
				translations={menu.translations}
				key={index} />;
		}) : null;

		return (
			<article className="content--module module--item-details no-metadata content--branches">
				<div className="content--container global-padding-wrapper branches-container">
					<h2 className="asset--subtitle">
                        {title}
                    </h2>
                    <div className="branch--add">
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