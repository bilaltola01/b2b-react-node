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

		return (
			<article className="content--module module--item-details no-metadata content--branches">
				<div className="content--container global-padding-wrapper branches-container">
					<h2 className="asset--subtitle">
                        {title}
                    </h2>
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