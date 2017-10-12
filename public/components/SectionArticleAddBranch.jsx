import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import ContactAdd from './ContactAdd';
import BranchContactsEdit from './BranchContactsEdit';
import BranchCuisinesEdit from './BranchCuisinesEdit';
import BranchLanguagesEdit from './BranchLanguagesEdit';
import ImageUpload from './ImageUpload';

let createHandlers = (ctx) => {
	let getProfile = () => {
        ctx.props.dispatch(actionCreators.getProfile());
    };

    let getAvailableLanguages = () => {
        ctx.props.dispatch(actionCreators.getLanguages());
    };

    let getAvailableCuisines = () => {
        ctx.props.dispatch(actionCreators.getCuisines());
    };

	let onImageUpload = () => {
		console.log('uploaded image!!');
	};

	let onBranchSaved = (res) => {
		console.log('branch saved!');
		ctx.setState({
			isSaved: true
		});
	};

	let onSaveBranch = (state) => {
		// save menu to db and use 'onBranchSaved' as callback
		console.log('should save all changes to the db and redirect');
		ctx.props.dispatch(actionCreators.saveBranch(state.branch, onBranchSaved));
	};

	let onChanges = (type, obj) => {
		console.log('/////////////////');
		console.log('MAIN ADD BRANCH HANDLER');
		console.log('/////////////////');
		// update store

		let newBranch;
		switch (type) {
			case 'main':
				obj.persist();
				console.log(type, obj);

				let name = obj.target.getAttribute('name');
				let key = name.substring(name.indexOf('branch-') + 7, name.length);

				ctx.setState((prevState) => {
					newBranch = prevState.branch;
					newBranch[key] = obj.target.value;

					console.log(newBranch);

					ctx.props.dispatch(actionCreators.setBranches(ctx.props.profile.branches, newBranch));

					return {
						branch: newBranch
					};
				});
			default:
				console.log(type, obj);

				ctx.setState((prevState) => {
					newBranch = prevState.branch;
					newBranch[type] = obj.data;

					console.log(newBranch);

					ctx.props.dispatch(actionCreators.setBranches(ctx.props.profile.branches, newBranch));

					return {
						branch: newBranch
					};
				});
		}
	};

	return {
		getProfile,
		getAvailableCuisines,
		getAvailableLanguages,
		onImageUpload,
		onSaveBranch,
		onChanges
	};
};

class SectionArticleAddBranch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branch: {
				Address: '',
				City: '',
				CompanyID: (props.profile) ? props.profile.CompanyID : null,
				Country: '',
				Email: '',
				Tel: '',
				Name: '',
				HasHeadquarters: false,
				contacts: [],
				cuisines: [],
				currency: [],
				images: [],
				languages: []
			},
			isSaved: false
		};
		this.handlers = createHandlers(this);
	}

	componentDidMount() {
        this.handlers.getProfile();
        this.handlers.getAvailableLanguages();
        this.handlers.getAvailableCuisines();
    }

	render() {
		const { title, dateUpdate, component } = this.props;

		console.log(this.props);

		const availableCuisines = this.props.availableCuisines || [];
		const availableLanguages = this.props.availableLanguages || [];

		const contactComponents = (
			<BranchContactsEdit contacts={[]} onChange={this.handlers.onChanges} />
		);

		const cuisineComponents = (
			<BranchCuisinesEdit cuisines={[]} availableCuisines={availableCuisines} onChange={this.handlers.onChanges} />
		);

		const branchLanguages = (
			<BranchLanguagesEdit languages={[]} onChange={this.handlers.onChanges} />
		);

		const allImagesComponent = (
			<ImageUpload onChanges={this.handlers.onChanges} onUploadSubmit={this.handlers.onImageUpload} images={[]} />
		);

		const addBranchComponent = (this.state.isSaved) ? (
			<Redirect to={{
                pathname: '/profile/get'
            }} />
		) : (
			<article className="content--module module--item-details no-metadata content--branches">
				<div className="content--container global-padding-wrapper branches-container">
					<h2 className="asset--subtitle">
                        Add Branch
                    </h2>
                    <div className="branches">
                    	<div className="article--branch">
							<div className="branch--contact aside--section contacts--support">
								<header className="branch--contact--header">
									<div className="header--title-container">
										<a href="#," className="collapsable opened">
											<h1 className="aside--title collapsable--title">
												New Branch
											</h1>
										</a>
									</div>
								</header>
								<div className="global-padding-wrapper">
									<div className="branch--menus edit">
										{
											/*
										<Link to={"/menu/add/"}>
											<button className="button--action button--action-filled">Add Menus</button>
										</Link>
										*/
										}
									</div>
									<div className="branch--title">
										<p className="menu--title">Name</p>
										<div className="content--edit">
											<div className="edit--block">
			                            		<label className="label--edit">Enter new Branch Name:</label>
			                        			<input className="input--edit" type="text" name="branch-Name" placeholder="New name..." onChange={(e) => this.handlers.onChanges('main', e)} />
			                        		</div>
			                        	</div>
									</div>
									<div className="branch--cuisines">
										<p className="menu--title">Cuisine Types</p>
										{cuisineComponents}
									</div>
									<div className="branch--languages">
										{branchLanguages}
									</div>
									<div className="branch--address">
							            <p className="menu--title">Address</p>
							            <div className="content--edit branch--address--edit">
							            	<div className="edit--block">
			                            		<label className="label--edit">Enter new Address:</label>
			                        			<input className="input--edit" type="text" name="branch-Address" placeholder="New address..." onChange={(e) => this.handlers.onChanges('main', e)} />
			                        		</div>
			                        		<div className="edit--block">
			                            		<label className="label--edit">Enter new Zipcode:</label>
			                        			<input className="input--edit" type="text" name="branch-Zipcode" placeholder="New zipcode..." onChange={(e) => this.handlers.onChanges('main', e)} />
			                        		</div>
			                        		<div className="edit--block">
			                            		<label className="label--edit">Enter new City:</label>
			                        			<input className="input--edit" type="text" name="branch-City" placeholder="New city..." onChange={(e) => this.handlers.onChanges('main', e)} />
			                        		</div>
			                        		<div className="edit--block">
			                            		<label className="label--edit">Enter new Country:</label>
			                        			<input className="input--edit" type="text" name="branch-Country" placeholder="New country..." onChange={(e) => this.handlers.onChanges('main', e)} />
			                        		</div>
							            </div>
							        </div>
							        <div className="branch--images">
							        	<p className="menu--title">Images</p>

										{allImagesComponent}
									</div>
									<div className="branch--contacts">
										<h3 className="branch--contacts--name">Contacts</h3>
										{contactComponents}
									</div>
								</div>
							</div>
							<div className="profile-save">
			                    <button id="profile-save" onClick={(e) => this.handlers.onSaveBranch(this.state)}>Save Menu</button>
			                </div>
						</div>
                    </div>
                </div>
			</article>
		);

		return addBranchComponent;
	}
};

SectionArticleAddBranch.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

const mapStateToProps = (state) => {
    console.log(state);
  	return {
  		branches: state._branches.branches,
    	profile: state._profile.profile,
    	availableLanguages: state._languages.languages,
    	availableCuisines: state._cuisines.cuisines
  	};
};

export default connect(mapStateToProps)(SectionArticleAddBranch);