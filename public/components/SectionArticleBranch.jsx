import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

const classNames = require('classnames');

import Contact from './Contact';
import BranchCuisine from './BranchCuisine';
import BranchLanguage from './BranchLanguage';
import BranchImage from './BranchImage';

let createHandlers = (ctx) => {
  let headerOnClick = () => {
    ctx.setState((prevState) => {
		return {
			expanded: !prevState.expanded
		};
	});
  };

  let goToBranch = () => {
  	ctx.setState({
  		redirect: true
  	});
  };

  return {
    headerOnClick,
    goToBranch
  };
};

class SectionArticleBranch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const {
			id,
			address,
			city,
			contacts,
			zipcode,
			country,
			cuisines,
			currency,
			email,
			hasHeadquarters,
			images,
			languages,
			name
		} = this.props;

		if (this.state.redirect) {
			return <Redirect push to={"/branch/get/" + id} />;
		}

		let contactComponents = (contacts.length > 0) ? contacts.map((contact, index) => {
			return <Contact id={contact.BranchContactID} imgPath={contact.ImagePath} altDesc={contact.ImageAltDesc} firstname={contact.Firstname} lastname={contact.Lastname} hasHeadquarters={contact.HasHeadquarters} email={contact.Email} tel={contact.Tel} key={contact.BranchContactID} />;
		}) : '';

		let cuisineComponents = (cuisines.length > 0) ? cuisines.map((cuisine, index) => {
			return (index < cuisines.length - 1)
				? (
					<div key={cuisine.BranchCuisineID}>
						<BranchCuisine id={cuisine.BranchCuisineID} description={cuisine.Cuisine.Description} title={cuisine.Cuisine.Title} key={cuisine.BranchCuisineID} />
						,&nbsp;
					</div>
				) : (
					<div key={cuisine.BranchCuisineID}>
						<BranchCuisine id={cuisine.BranchCuisineID} description={cuisine.Cuisine.Description} title={cuisine.Cuisine.Title} key={cuisine.BranchCuisineID} />
					</div>
				)
		}) : '';

		let languageComponents = (languages.length > 0) ? languages.map((language, index) => {
			return <BranchLanguage id={language.BranchLanguageID} code={language.Language.Code} codeFull={language.Language.CodeFull} name={language.Language.Name} title={language.Language.Title} key={language.BranchLanguageID} />;
		}) : '';

		let imageComponents = (images.length > 0) ? images.map((image, index) => {
			return (
				<li key={image.BranchImageID}>
					<BranchImage id={image.BranchImageID} imgPath={image.Path} altDesc={image.AltDesc} key={image.BranchImageID} />
				</li>
			)
		}) : '';

		const classes = classNames(
			'branch--contact--header',
			'collapsable',
			(this.state.expanded) ? 'opened' : ''
		);


		return (
			<div className="article--branch">
				<div className="branch--contact aside--section contacts--support">
					<header className={classes} onClick={this.handlers.headerOnClick}>
						<div className="header--title-container">
							<h1 className="aside--title collapsable--title">
								{name}
							</h1>
						</div>
						<div className="header--actions">
							<ul>
								<li><Link to={"/branch/edit/" + id} className="action--edit">Edit</Link></li>
								<li><Link to={"/branch/delete/" + id} className="action--delete">Delete</Link></li>
							</ul>
						</div>
					</header>
					<div className="global-padding-wrapper">
						<div className="goto" onClick={this.handlers.goToBranch}>
							<div className="branch--menus">
								<Link to={"/menu/branch/" + id}>
									<p>Menus</p>
									<img src="assets/images/icon-menu-white.svg" alt={"Icon of " + name + " branch menus"} />
								</Link>
							</div>
							<div className="branch--cuisines">
								<p className="menu--title">Cuisine Types</p>
								{cuisineComponents}
							</div>
							<div className="branch--languages">
								<p className="menu--title">Languages</p>
								{languageComponents}
							</div>
							<div className="branch--address">
					            <p className="menu--title">Address</p>
					            <address className="label--key">
					                {address}<br />
					                {zipcode} {city}<br />
					                {country}<br />
					            </address>
					        </div>
					        <div className="branch--images">
								<ul>
									{imageComponents}
								</ul>
							</div>
							<div className="branch--contacts">
								<h3 className="branch--contacts--name">Contacts</h3>
								{contactComponents}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
};

SectionArticleBranch.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default SectionArticleBranch;