import React, { Component, PropTypes } from 'react';

import MealDetail from './MealDetail';

let createHandlers = (ctx) => {
	let onRemove = (obj, fn) => {
		ctx.setState({
			removed: true
		});
		// actually remove that thing from the global store
		if (typeof fn === 'function') {
			fn(obj);
		}
	};

	let onChange = (obj, fn) => {
		if (obj.target && obj.key) {
			// actually remove that thing from the global store
			if (typeof fn === 'function') {
				let title = document.querySelector('#meal-id-' + ctx.props.id + ' #meal-title').value;
				let desc = document.querySelector('#meal-id-' + ctx.props.id + ' #meal-description').value;

				console.log(title);
				console.log(desc);

				let tmp = {
					id: ctx.props.id,
					title: title,
					description: desc
				};

				console.log(tmp);

				tmp[obj.key] = obj.target.target.value;
				console.log(tmp);
				fn(tmp);
			}
		}
	};

	return {
		onRemove,
		onChange
	};
};

class MealEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			removed: false
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { id, title, description, enableDetails, detail, onRemove, onChange } = this.props;
		let detailComponents = '';

		if (Object.keys(detail).length > 0 && enableDetails) {
			detailComponents = <MealDetail id={detail.id} title={detail.title} description={detail.description} medias={detail.medias} />;
		}

		return (
			<div id={"meal-id-" + id}>
				<h4 className="meal--edit--title">
					Meal n°{id}
					<span className="status status--issue remove" onClick={(e) => this.handlers.onRemove({id}, onRemove)}></span>
				</h4>
				<div className="content--edit">
		            <div className="edit--block">
	                    <label className="label--edit">Enter new Title:</label>
	                    <input className="input--edit" type="text" name="meal--title" id="meal-title" defaultValue={title} onChange={(e) => this.handlers.onChange({target: e, key: 'title'}, onChange)} />
	                </div>
	                <div className="edit--block">
	                    <label className="label--edit">Enter new Description:</label>
	                    <input className="input--edit" type="text" name="meal--description" id="meal-description" defaultValue={description} onChange={(e) => this.handlers.onChange({target: e, key: 'description'}, onChange)} />
	                </div>
		            {detailComponents}
	            </div>
            </div>
		)
	}
};

MealEdit.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	enableDetails: PropTypes.bool,
	detail: PropTypes.object,
	onRemove: PropTypes.func,
	onChange: PropTypes.func
};

export default MealEdit;