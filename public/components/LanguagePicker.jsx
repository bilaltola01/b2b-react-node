import React, { Component, PropTypes } from 'react';

class LanguagePicker extends Component {
	render() {
		const { onPickerClick, onPickerItemClick, data } = this.props;

		let firstItemTitle;
		switch (data.type) {
			case 'languages':
				firstItemTitle = (data.items && data.items.length > 0) ? data.items[0].Name : '';
			default:
				firstItemTitle = (data.items && data.items.length > 0) ? data.items[0].Title : '';
		}

		const options = (data.items && data.items.length > 0) ? data.items.map((item, index) => {
			let finalCode = item.CodeFull ? item.CodeFull : item.Code;
			switch (data.type) {
				case 'languages':
					return (
						<option value={finalCode} key={item.LanguageID}>{item.Name}</option>
					);
				case 'cuisines':
					return (
						<option value={item.Title} key={item.CuisineID}>{item.Title}</option>
					);
				case 'categories':
					return (
						<option value={item.title} key={item.id}>{item.title}</option>
					);
				default:
					return (
						<option value={item.codeFull} key={item.id}>{item.title}</option>
					);
			}
		}) : null;

		const selectOptions = (data.items && data.items.length > 0) ? data.items.map((item, index) => {
			let finalCode = item.CodeFull ? item.CodeFull : item.Code;
			switch (data.type) {
				case 'languages':
					return (
						<li data-id={item.LanguageID} rel={finalCode} onClick={(e) => onPickerItemClick(e)} key={item.LanguageID}>{item.Name}</li>
					);
				case 'cuisines':
					return (
						<li data-id={item.CuisineID} rel={item.Title} onClick={(e) => onPickerItemClick(e)} key={item.CuisineID}>{item.Title}</li>
					);
				case 'categories':
					return (
						<li data-id={item.id} rel={item.title} onClick={(e) => onPickerItemClick(e)} key={item.id}>{item.title}</li>
					);
				default:
					return (
						<li data-id={item.id} rel={item.codeFull} onClick={(e) => onPickerItemClick(e)} key={item.id}>{item.title}</li>
					);
			}
		}) : null;

		return (
			<div className="custom-select">
                <select id="pick--language" className="select-hidden" onChange={(e) => onAdd()}>
                	{options}
                </select>
                <div className="select--styled text--select" data-rel="en-gb" onClick={(e) => onPickerClick(e)}>{firstItemTitle}</div>
                <ul className="select--options">
                	{selectOptions}
                </ul>
            </div>
		)
	}
};

LanguagePicker.propTypes = {
	onPickerClick: PropTypes.func,
	onPickerItemClick: PropTypes.func,
	data: PropTypes.object
};

export default LanguagePicker;