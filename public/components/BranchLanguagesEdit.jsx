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

			const selectedBranches = (ctx.props.menu && ctx.props.menu.branches.length > 0) ? ctx.props.menu.branches : [];
			const branchLanguages = (selectedBranches && selectedBranches.length > 0) ? selectedBranches.reduce((acc, current) => {
				return acc.concat(current.languages.map(lang => lang.Language));
			}, []) : languages || [];

			let newLang = branchLanguages.find(lang => {
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
		const { languages, onChange } = this.props;

		const selectedBranches = (this.props.menu && this.props.menu.branches.length > 0) ? this.props.menu.branches : [];
		const branchLanguages = (selectedBranches && selectedBranches.length > 0) ? selectedBranches.reduce((acc, current) => {
			return acc.concat(current.languages.map(lang => lang.Language));
		}, []) : languages || [];

		console.log(branchLanguages);

		// list of all languages available is retrieved from selected branches
		const obj = {
			type: "languages",
			items: branchLanguages
		};

		console.log(this.state);

		const languageComponents = (this.state.allLanguages && this.state.allLanguages.length > 0) ? this.state.allLanguages.map((language, index) => {
			return <BranchLanguageEdit id={language.LanguageID} code={language.Code} codeFull={language.CodeFull} name={language.Name} title={language.Title} onRemove={this.handlers.onRemove} key={language.LanguageID} />;
		}) : null;

		return (branchLanguages && branchLanguages.length > 0) ? (
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
		) : null;
	}
};

BranchLanguagesEdit.propTypes = {
	languages: PropTypes.array,
	onChange: PropTypes.func
};

const mapStateToProps = (state) => {
	console.log(state);
  return {
    menu: state._menu.menu,
    languages: state._languages.languages
  };
};

export default connect(mapStateToProps)(BranchLanguagesEdit);