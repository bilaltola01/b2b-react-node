import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

const classNames = require('classnames');

import Menu from './Menu';
import Translation from './Translation';

let createHandlers = (ctx) => {
	let headerOnClick = () => {
	    ctx.setState((prevState) => {
			return {
				expanded: !prevState.expanded
			};
		});
	};

	let mealHeaderOnClick = () => {
		ctx.setState((prevState) => {
			return {
				mealExpanded: !prevState.mealExpanded
			};
		});
	};

 	let goToMenu = () => {
  		ctx.setState({
  			redirect: true
  		});
  	};

  	return {
    	goToMenu,
    	headerOnClick,
    	mealHeaderOnClick
  	};
};

class SectionArticleTranslation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
			mealExpanded: false
		};
		this.handlers = createHandlers(this);
	}

	convertToMenu(cats) {
		return cats;
	}

	render() {
		const {
			id,
			title,
			originaltitle,
			description,
			originaldescription,
			categories
		} = this.props;

		const status = (categories && categories.length > 0) ? categories[0].Status : 'PENDING';

		const languageName = (categories && categories.length > 0) ? categories[0].BranchLanguageName : '';

		const menuObj = {
			id: id,
			title: "",
			ownProps: {
				title: title + '(' + originaltitle + ')',
				description: description + '(' + originaldescription + ')',
				categories: this.convertToMenu(categories)
			}
		};

		const translatedMenu = (status === 'PENDING') ? 
			(
				<div className="translation--status">
					<div className="content--container">
                		<div className="food-menu pending">
							Translation is pending...
						</div>
					</div>
				</div>
			) : (
				<Menu ownProps={menuObj} />
			);

		const classes = classNames(
			'branch--contact--header',
			'collapsable',
			'status--' + status.toLowerCase(),
			(this.state.expanded) ? 'opened' : ''
		);

		const classesMeal = classNames(
			'branch--contact--header',
			'collapsable',
			'translation--meals',
			(this.state.mealExpanded) ? 'opened' : ''
		);

		if (this.state.redirect) {
			return <Redirect push to={"/menu/get/" + id} />;
		}

		let languageComponent = (categories && categories.length > 0) ?
			<span className="language--name">
				<span>{languageName}</span>
			</span>
		: null;

		let categoriesComponent = (categories && categories.length > 0) ? categories.map((category, index) => {
			let mealComponents = (category.meals && category.meals.length > 0) ? category.meals.map((meal, mindex) => {
				return <div id={"meal-id-" + meal.MealID} key={mindex} >
					<h4 className="meal--edit--title">
						Meal n°{meal.MealID}
					</h4>
					<div className="content--edit">
			            <div className="edit--block">
		                    <label className="label--edit">Original {meal.PropKey}:</label>
		                    <p className="input--edit">{meal.OriginalText}</p>
		                    <label className="label--edit">Translated {meal.PropKey}:</label>
		                    <p className="input--edit">{meal.Text || 'Pending...'}</p>
		                </div>
		            </div>
	            </div>;
			}) : null;

			return <div className="food-menu--part" key={index}>
        		<h4>
        			Category n°{category.MenuCategoryID}
        		</h4>
        		<div className="food-menu-meals translation">
        			<div className="branch--contact aside--section contacts--support">
						<header className={classesMeal} onClick={this.handlers.mealHeaderOnClick}>
							<div className="header--title-container">
								<h1 className="aside--title collapsable--title">
									Meals ({category.OriginalText})
								</h1>
							</div>
						</header>
						<div className="global-padding-wrapper">
							<div className="food-menu--meal">
			                	{mealComponents}
			                </div>
						</div>
					</div>
                </div>
            </div>;
		}) : null;

		let translationMeals = (categories && categories.length > 0) ?
			<div>
				<header className="article--menu--translations--header">
					<p className="menu--title">
						Translated Meals
					</p>
					<div>
						<div className="content--label">
							<h3 className="label--key">Status:</h3>
							<span className="label--value">{status}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Total:</h3>
							<span className="label--value">{categories.length}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Language:</h3>
							<span className="label--value">{languageComponent}</span>
						</div>

					</div>
				</header>

				<div className="translation--categories">
					{categoriesComponent}
				</div>
			</div>
		: null;

		let translationCategories = (categories && categories.length > 0) ?
			<div>
				<header className="article--menu--translations--header">
					<p className="menu--title">
						Translated Categories
					</p>
					<div>
						<div className="content--label">
							<h3 className="label--key">Status:</h3>
							<span className="label--value">{status}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Total:</h3>
							<span className="label--value">{categories.length}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Language:</h3>
							<span className="label--value">{languageComponent}</span>
						</div>
					</div>
				</header>

				<div className="translation--categories">
					<div className="article--menu--translations">
						{translationMeals}
					</div>
				</div>
			</div>
		: null;

		let translatedTitle = (title) ? title : 'PENDING';
		let translatedDescription = (description) ? description : 'PENDING';


		return (
			<div className="article--menu">
				<div className="branch--contact aside--section contacts--support">
					<header className={classes} onClick={this.handlers.headerOnClick}>
						<div className="header--title-container">
							<h1 className="aside--title collapsable--title">
								Menu: {originaltitle} - {languageName}
							</h1>
						</div>
					</header>
					<div className="global-padding-wrapper">
						<div className="article--menu--translations">
							<header className="article--menu--translations--header">
								<p className="menu--title">
									{originaltitle} - {originaldescription}
								</p>
								<div>
									<div className="content--label">
										<h3 className="label--key">Translated Title:</h3>
										<span className="label--value">{translatedTitle}</span>
									</div>
									<div className="content--label">
										<h3 className="label--key">Translated Description:</h3>
										<span className="label--value">{translatedDescription}</span>
									</div>
								</div>
							</header>
						</div>
						<div className="article--menu--translations">
							{translationCategories}
						</div>
						<div className="goto">
							<p className="menu--title">
								Translated Menu
							</p>
							{translatedMenu}
						</div>
					</div>
				</div>
			</div>
		)
	}
};

SectionArticleTranslation.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	originaltitle: PropTypes.string,
	description: PropTypes.string,
	originaldescription: PropTypes.string,
	categories: PropTypes.array
};

export default SectionArticleTranslation;