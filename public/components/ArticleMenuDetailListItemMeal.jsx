import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router-dom';

class ArticleMenuDetailListItemMeal extends Component {
 	constructor(props) {
  	super(props);
	}

	getTranslatedMeal(lang, translations) {
  	if (!lang || !translations || translations.length <= 0) {
    		return null;
  	}

  	const langTranslations = translations.filter(t => {
    		return (t.BranchLanguageID === lang.BranchLanguageID) || (t.BranchLanguageName === lang.Title);
  	});

  	const title = (langTranslations && langTranslations.length > 0) ? langTranslations.find(lang => lang.PropKey === 'title').Text : null;
  	const description = (langTranslations && langTranslations.length > 0) ? langTranslations.find(lang => lang.PropKey === 'description').Text : null;

  	if (!title && !description) {
  		return null;
  	}

  	return {
  		title: title,
  		description: description
  	};
	}

	isCurrentLanguageDefault(language) {
		return language.LanguageID === 23;
	}

	render() {
		const { meal, currency, index, currentLanguage } = this.props;

    console.log(this.props);

		const symbol = (currency && currency.Currency) ? currency.Currency.Symbol : '£';

		const translatedMeal = this.getTranslatedMeal(currentLanguage, meal.translations);

		const titleComponent = (translatedMeal && !this.isCurrentLanguageDefault(currentLanguage)) ? (
    	<h2>{translatedMeal.title}<br />
      		<em>({meal.Title})</em>
    	</h2>
  	) : (
    	<h2>{meal.Title}</h2>
  	);

  	const descriptionComponent = (translatedMeal && !this.isCurrentLanguageDefault(currentLanguage)) ? (
  		<p className="meal--desc">
  			{translatedMeal.description}
  		</p>
  	) : (
  		<p className="meal--desc">
  			{meal.Description}
  		</p>
  	);

  	return (
    	<section className="meal">
        <div className="meal--header">
            <div className="price">
            	{symbol} {meal.Price}
            </div>
            <header>
            	{titleComponent}
        	</header>
        </div>
      		<div className="meal--content">
      			{descriptionComponent}
      		</div>
    	</section>
  	);
	}
};

ArticleMenuDetailListItemMeal.propTypes = {
	meal: PropTypes.object,
  currency: PropTypes.object,
  currentLanguage: PropTypes.object
};

export default ArticleMenuDetailListItemMeal;