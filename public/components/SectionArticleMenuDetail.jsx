import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

const classNames = require('classnames');

import Menu from './Menu';
import SubNav from './SubNav';
import ArticleMenuDetailListItem from './ArticleMenuDetailListItem';

const DEFAULT_LANGUAGE = {
  LanguageID: 23,
  Language: {
    Code: "en",
    CodeFull: "en-GB",
    Flag: {
      FlagID: 23,
      AltDescription: "English",
      Title: "English",
      Path: "https://res.cloudinary.com/one-menu/image/upload/v1509377412/United_Kingdom_vix6gw.svg",
      Date: "2017-10-30T00:00:00.000Z",
      DateUpdated: "2017-07-17T23:00:00.000Z"
    },
    FlagID: 23,
    LanguageID: 23,
    Name: "English",
    Title: "English"
  }
};

let createHandlers = (ctx) => {
	let onNavItemClick = (item) => {
		ctx.setState({
			currentSubNavItem: item.index
		});
	};

	let onLanguageClick = (e, lang, index) => {
	    ctx.props.dispatch(actionCreators.setCurrentLanguage(lang, (res) => {
	    	console.log('changed current language!');
	    	console.log(res);

	    	ctx.setState({
	    		currentLanguage: lang,
	    		currentLanguageItem: index
	    	});
	    }));
	 };

  	return {
  		onLanguageClick,
    	onNavItemClick
  	};
};

class SectionArticleMenuDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentSubNavItem: 0,
			currentLanguageItem: 0,
			currentLanguage: props.currentLanguage || DEFAULT_LANGUAGE
		};
		this.handlers = createHandlers(this);
	}

	getNavItemClasses(index) {
		const classes = classNames(
			'language--item',
			(this.state.currentLanguageItem === index) ? 'selected' : ''
		);
		return classes;
	}

	render() {
		const {
			id,
			title,
			description,
			price,
			dateUpdate,
			categories,
			languages,
			translations,
			currencies
		} = this.props;

		console.log(this.props);

		const currency = (currencies && currencies.length > 0) ? currencies[0] : {};
		const currencySymbol = (currency && currency.Currency) ? currency.Currency.Symbol : '£';

		const ownProps = {
			id,
			Title: title,
			Description: description,
			Price: price,
			categories
		};

		const finalLanguages = (this.state.currentLanguage && languages && languages.length > 0) ?
	    	((languages.find(lang => lang.LanguageID === DEFAULT_LANGUAGE.LanguageID)) ?
	        	languages : [
	          		{
	            		LanguageID: DEFAULT_LANGUAGE.LanguageID,
	            		Language: DEFAULT_LANGUAGE.Language
	          		}
	        	].concat(languages)
	      	) : [DEFAULT_LANGUAGE];

      	console.log(finalLanguages);

		const currentItem = this.state.currentSubNavItem || 0;

		const languageItems = (finalLanguages && finalLanguages.length > 0) ? finalLanguages.map((language, index) => {
			const lang = (language.Language) ? language.Language : language;
			return <li key={index}>
				<div className={this.getNavItemClasses(index)} onClick={(e) => this.handlers.onLanguageClick(e, lang, index)}>
					{lang && lang.Flag && lang.Flag.Path &&
		            	<img src={lang.Flag.Path} alt={lang.Flag.AltDescription} />
		            }

		            {lang && (!lang.Flag || !lang.Flag.Path) && lang.Name &&
		            	<p>
		            		{lang.Name}
		            	</p>
		            }
				</div>
			</li>;
		}) : null;

		const languagesComponent = (
			<ul>
				{languageItems}
			</ul>
		);

		const noTranslationsComponent = (translations || translations.length <= 0) ? (
			<div className="global-padding-wrapper">
				<div className="branch--add">
					<div className="add-item dashed">
						<h2 className="no-items--headline">It looks like your menu translations are pending or your menu is not translated yet.</h2>
					</div>
				</div>
			</div>
		) : null;

		const categoriesComponent = (categories && categories.length > 0) ? categories.map((category, index) => {
			return <ArticleMenuDetailListItem nbItems={categories.length} currentItem={currentItem} category={category} currency={currency} language={this.props.currentLanguage} key={index} />;
		}) : null;

		const subnavComponent = (categories && categories.length > 0) ? (
			<SubNav categories={categories} currentItem={currentItem} onNavItemClick={this.handlers.onNavItemClick} />
		) : null;

		const containerWidth = (categories && categories.length > 0) ? (
			(100 * categories.length) + '%'
		) : '100%';

		const translate = (categories && categories.length > 0) ? (
			'translateX('+ -((this.state.currentSubNavItem * 100) / categories.length) + '%)'
		) : '0%';


		return (
			<div className="article--menu-detail">
				<header className="menu-detail--header">
					<h1 className="menu-detail--title">
						{title}
					</h1>
					<h2>
						{description}
					</h2>
					<h3>{currencySymbol} {price}</h3>
				</header>
				<div className="menu-detail--languages">
					{languagesComponent}
				</div>

				{noTranslationsComponent}

				{subnavComponent}

				<div className="menu-categories menu-detail">
					<div className="categories-container" data-item-active={currentItem} style={{width: containerWidth, transform: translate}}>
						{categoriesComponent}
					</div>
				</div>
			</div>
		)
	}
};

SectionArticleMenuDetail.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.number,
	dateUpdate: PropTypes.object,
	categories: PropTypes.array,
	languages: PropTypes.array,
	translations: PropTypes.array,
	currencies: PropTypes.array
};


const mapStateToProps = (state) => {
    console.log(state);
    return {
        currentLanguage: state._currentLanguage.currentLanguage
    };
};

export default connect(mapStateToProps)(SectionArticleMenuDetail);