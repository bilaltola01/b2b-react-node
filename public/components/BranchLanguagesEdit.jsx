import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import * as DomUtils from '../shared/dom.utils';

import BranchLanguageEdit from './BranchLanguageEdit';
import LanguagePicker from './LanguagePicker';

let createHandlers = (ctx) => {
	let onAdd = (obj) => {
		let languages;
		ctx.setState((prevState) => {
			languages = prevState.allLanguages;

			let newLang = ctx.props.availableLanguages.find(lang => {
				return lang.LanguageID === obj.id;
			});

			if (newLang) {
				languages.push(newLang);
			}

			if (ctx.props.onChange && typeof ctx.props.onChange === 'function') {
				ctx.props.onChange('languages', {data: languages});
			}

			return {
				allLanguages: languages
			}
		});
	};

	let onRemove = (obj) => {
		let languages;
		ctx.setState((prevState) => {
			languages = prevState.allLanguages.reduce((acc, current) => {
				return (current.id !== obj.id) ? acc.concat([current]) : acc;
			}, []);

			console.log(prevState.allLanguages);

			console.log(languages);

			ctx.props.onChange('languages', {data: languages});

			return {
				allLanguages: languages
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

		// Then add the new language
		onAdd({
			id,
			rel,
			name: text
		});
	};

	return {
		onAdd,
		onRemove,
		onPickerClick,
		onPickerItemClick
	};
};

class BranchLanguagesEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allLanguages: []
		};
		this.handlers = createHandlers(this);
	}

	render() {
		const { languages, availableLanguages, onChange } = this.props;

		console.log(availableLanguages);

		// list of all languages available should be retrieved from db
		const obj = {
			type: "languages",
			items: availableLanguages || []
		};

		console.log(this.state);

		const languageComponents = (this.state.allLanguages && this.state.allLanguages.length > 0) ? this.state.allLanguages.map((language, index) => {
			return <BranchLanguageEdit id={language.LanguageID} code={language.Code} codeFull={language.CodeFull} name={language.Name} title={language.Title} onRemove={this.handlers.onRemove} key={language.LanguageID} />;
		}) : null;

		return (
			<div>
				<p className="menu--title">Languages</p>
				<div>
					{languageComponents}
				</div>

				<div id="language-add" className="language--add">
					<label>Add a Language:</label>
					<div id="language-picker" className="language--picker">
						<LanguagePicker data={obj} onAdd={this.handlers.onAdd} onPickerClick={this.handlers.onPickerClick} onPickerItemClick={this.handlers.onPickerItemClick} />
                    </div>
				</div>
			</div>
		)
	}
};

BranchLanguagesEdit.propTypes = {
	languages: PropTypes.array,
	availableLanguages: PropTypes.array,
	onChange: PropTypes.func
};

export default BranchLanguagesEdit;