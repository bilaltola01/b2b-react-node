import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import SectionArticleTranslation from './SectionArticleTranslation';

class SectionArticleTranslations extends Component {
	render() {
		const { title, dateUpdate, component } = this.props;

		console.log(component.props);

		const menuComponents = (component.props.translations && component.props.translations.length > 0) ? component.props.translations.map((translation, index) => {
			return <SectionArticleTranslation 
				id={translation.id}
				title={translation.title}
				originaltitle={translation.originaltitle}
				description={translation.description}
				originaldescription={translation.originaldescription}
				categories={translation.categories}
				key={index} />;
		}) : null;


		const noItemsComponent = (!menuComponents || menuComponents.length <= 0) ? (
			<div className="branch--add">
				<h2 className="no-items--headline">Oh no! It looks like you have no menus translations yet.</h2>
				<Link to="/menus" >
					<div className="add-item dashed">
						<span>Go to your Menus</span>
					</div>
				</Link>
			</div>
		) : null;

		return (
			<article className="content--module module--item-details no-metadata content--branches">
				<div className="content--container global-padding-wrapper branches-container">
					<h2 className="asset--subtitle">
                        {title}
                    </h2>
                    {noItemsComponent}
                    <div className="branches menus">
                    	{menuComponents}
                    </div>
                </div>
			</article>
		)
	}
};

SectionArticleTranslations.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default SectionArticleTranslations;