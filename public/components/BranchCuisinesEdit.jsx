import React, { Component, PropTypes } from 'react';

import * as DomUtils from '../shared/dom.utils';

import BranchCuisineEdit from './BranchCuisineEdit';
import LanguagePicker from './LanguagePicker';

let createHandlers = (ctx) => {
	let onAdd = (obj) => {
		ctx.setState((prevState) => {
			let cuisines = prevState.allCuisines;

			let newCuisine = ctx.props.availableCuisines.find(cuisine => {
				return cuisine.CuisineID === obj.id;
			});

			if (newCuisine) {
				cuisines.push(newCuisine);
			}

			ctx.props.onChange('cuisines', {data: cuisines});

			return {
				allCuisines: cuisines
			}
		});
		// actually add that thing to the global store
	};

	let onRemove = (obj) => {
		ctx.setState((prevState) => {
			let cuisines = prevState.allCuisines.reduce((acc, current) => {
				return (current.id !== obj.id) ? acc.concat([current]) : acc;
			}, []);

			console.log(prevState.allCuisines);

			console.log(cuisines);

			ctx.props.onChange('cuisines', {data: cuisines});

			return {
				allCuisines: cuisines
			}
		});
	};

	let onPickerClick = (e) => {
		DomUtils.toggleClass(e.target, 'active');
	};

	let onPickerItemClick = (e) => {
		// Change UI
		let rel = e.target.getAttribute('rel');
		let text = e.target.textContent;
		let id = parseInt(e.target.getAttribute('data-id'), 10);
		let target = e.target.parentNode.previousElementSibling;
		target.setAttribute('data-rel', rel);
		target.textContent = text;
		DomUtils.toggleClass(target, 'active');

		// Then add the new cuisine
		onAdd({
			id,
			rel,
			title: text
		});
	};

	return {
		onAdd,
		onRemove,
		onPickerClick,
		onPickerItemClick
	};
};

class BranchCuisinesEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCuisines: []
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { cuisines, availableCuisines, onChange } = this.props;

		console.log(cuisines);
		console.log(availableCuisines);

		// List of all cuisines availables is to retrieved dynamically from db
		const obj = {
			type: "cuisines",
			items: availableCuisines
		};

		console.log(this.state);

		const cuisineComponents = (this.state.allCuisines && this.state.allCuisines.length > 0) ? this.state.allCuisines.map((cuisine, index) => {
			return (index < this.state.allCuisines.length - 1)
				? (
					<span key={cuisine.CuisineID}>
						<BranchCuisineEdit id={cuisine.CuisineID} description={cuisine.Description} title={cuisine.Title} onRemove={this.handlers.onRemove} key={cuisine.CuisineID} />
						,&nbsp;
					</span>
				) : (
					<span key={cuisine.CuisineID}>
						<BranchCuisineEdit id={cuisine.CuisineID} description={cuisine.Description} title={cuisine.Title} onRemove={this.handlers.onRemove} key={cuisine.CuisineID} />
					</span>
				)
		}) : null;

		return (
			<div>
				{cuisineComponents}

				<div id="language-add" className="language--add">
					<label>Add a Cuisine:</label>
					<div id="cuisine-picker" className="language--picker">
						<LanguagePicker data={obj} onAdd={this.handlers.onAdd} onPickerClick={this.handlers.onPickerClick} onPickerItemClick={this.handlers.onPickerItemClick} />
                    </div>
				</div>
			</div>
		)
	}
};

BranchCuisinesEdit.propTypes = {
	cuisines: PropTypes.array,
	availableCuisines: PropTypes.array,
	onChange: PropTypes.func
};

export default BranchCuisinesEdit;