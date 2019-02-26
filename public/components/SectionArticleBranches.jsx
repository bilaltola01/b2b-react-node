import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { has, filter, size, forEach, map } from 'lodash';

import SectionArticleBranch from './SectionArticleBranch';
import LanguagePicker from "./LanguagePicker";
import * as DomUtils from "../shared/dom.utils";
import BranchLanguagesEdit from "./BranchLanguagesEdit";
import MenuBranchesEdit from "./MenuBranchesEdit";
import * as actionCreators from '../action-creators';
import LanguagesEdit from "./LanguagesEdit";
import BranchMenusEdit from "./BranchMenusEdit";
import Checkbox from 'react-simple-checkbox';

class SectionArticleBranches extends Component {
  constructor(props) {
  	super(props)
		this.state = {
      selected: {},
			action: null,
			menus: [],
			languages: []
    };
		this.onToggleSelection = this.onToggleSelection.bind(this);
		this.toggleAllSelection = this.toggleAllSelection.bind(this);
		this.allSelected = this.allSelected.bind(this);
		this.onPickerClick = this.onPickerClick.bind(this);
		this.onPickerItemClick = this.onPickerItemClick.bind(this);
		this.onApply = this.onApply.bind(this);
		this.onChanges = this.onChanges.bind(this);
	}

	onToggleSelection(e, id) {
  	let selected = {...this.state.selected};
    if (id) {
      selected[id] = 	has(selected, id) ? !selected[id] : true;
		}

		this.setState({selected});
	}

  toggleAllSelection() {
    let selected = {};

  	if (!this.allSelected()) {
      forEach(this.props.component.props.branches, (branch) => {
        selected[branch.BranchID] = true
      })
		}

		this.setState({selected});
	}

  allSelected() {
    const selectedCount = size(filter(this.state.selected, item => item === true));

    return selectedCount === size(this.props.component.props.branches)
	}

  onAdd() {

	}

  onKeyPress(e) {
		if (e.key == "Enter") {
			// onAdd({
			// 	id: null,
			// 	rel: e.target.value,
			// 	name: e.target.value
			// });
			e.target.value = "";
		}
	};

  onPickerItemClick(e) {
    // Change UI
    let rel = e.target.getAttribute('rel');
    let text = e.target.textContent;
    let id = parseInt(e.target.getAttribute('data-id'), 10);
    let target = e.target.parentNode.previousElementSibling;
    target.setAttribute('data-rel', rel);
    target.textContent = text;

    DomUtils.toggleClass(target, 'active');

    console.log('menu item', id)
		this.setState({action: id})
    // Then add the new language
    // onAdd({
    //   id,
    //   rel,
    //   name: text
    // });
  };

  onPickerClick(e) {
    DomUtils.toggleClass(e.target, "active");
  }

  onPickerBlur(e) {
    let select = e.target.querySelector('.select--styled.active');
    if (select) {
      DomUtils.toggleClass(select, 'active');
    }
	}

  onChanges(type, obj) {
		console.log(type, obj)
		this.setState({[type]: obj && obj.data || []})
		// console.log('changing', ctx.props.menu);
		let dataToUpdate = {};
	};

  onApply() {
  	const {selected, action} = this.state;
		const branches = map(selected, (item, index) => {
			if (item) {
				return parseInt(index);
			}
    });

		const menus = map(this.state.menus, item => item.MenuID)
		const languages = map(this.state.languages, item => item.LanguageID)
		console.log('onApply', selected, action, branches, menus, languages)
		if (action === 1 && size(branches) > 0 && size(menus) > 0) {
      this.props.dispatch(actionCreators.addMenusToBranches(branches, menus, (res) => {
      	console.log('res', res);
      	this.setState({action: null, menus: [], languages: []});
			} ));
		} else if (action === 2 && size(branches) > 0 && size(languages) > 0) {
      this.props.dispatch(actionCreators.addLanguagesToBranches(branches, languages, (res) => {
        console.log('res', res);
        this.setState({action: null, menus: [], languages: []});
      } ));
    }
	}

  componentDidMount() {
    this.props.dispatch(actionCreators.getLanguages());
    this.props.dispatch(actionCreators.getMenus());
  }

	render() {
		const { title, dateUpdate, component } = this.props;

		// console.log(component.props);
		// console.log('selected', this.state.selected);

		const branchComponents = (component.props.branches && component.props.branches.length > 0) ? component.props.branches.map((branch, index) => {
			return <SectionArticleBranch 
				id={branch.BranchID}
				address={branch.Address}
				city={branch.City}
				contacts={branch.contacts}
				zipcode={branch.zipcode}
				country={branch.Country}
				currencies={branch.currencies}
				email={branch.email}
				hasHeadquarters={parseInt(branch.HasHeadquarters, 10)}
				images={branch.images}
				languages={branch.languages}
				cuisines={branch.cuisines}
				isEnabled={branch.IsEnabled}
				name={branch.Name}
				selected={this.state.selected}
				onToggleSelection={this.onToggleSelection}
				key={index} />;
		}) : null;

		const noItemsComponent = (!branchComponents || branchComponents.length <= 0) ? (
			<h2 className="no-items--headline">Oh no! It looks like you have not added any branches yet.</h2>
		) : null;

    const obj = {
      type: "actions",
      items: [
				{id: 1, title: 'Assign Menu', codeFull: 'menu'},
				{id: 2, title: 'Assign Language', codeFull: 'language'},
			]
    };
    const availableLanguages = this.props.availableLanguages || [];
    const availableMenus = this.props.availableMenus || [];

		return (
			<article className="content--module module--item-details no-metadata content--branches">
				<div className="content--container global-padding-wrapper branches-container">

					<h2 className="asset--subtitle">{title}</h2>

					<div className="branches--actions-wrap">
						<Checkbox
							id="all-branch-selected"
							size={3}
							tickSize={2}
							color="#727B9C"
							checked={this.allSelected()}
							onChange={this.toggleAllSelection}
						/>
						<label className="checkbox-label" htmlFor="all-branch-selected">Select All</label>
						<div style={{margin: '0 20px'}}>
							<LanguagePicker
								data={obj}
								onKeyPress={this.onKeyPress}
								onAdd={this.onAdd}
								onPickerBlur={this.onPickerBlur}
								onPickerClick={this.onPickerClick}
								onPickerItemClick={this.onPickerItemClick}
							/>
						</div>
						<div className="group-buttons">
							<button className="button--action" onClick={this.onApply}>Apply</button>
						</div>
					</div>

					{this.state.action === 1
						? (
							<div className="branch--currencies">
								<BranchMenusEdit menus={[]} availableCurrencies={availableMenus} onChange={this.onChanges} />
							</div>
						) : null
					}

					{this.state.action === 2
						? (
							<div className="branch--languages">
								<p className="menu--title">Languages</p>
								<LanguagesEdit languages={[]} availableLanguages={availableLanguages} onChange={this.onChanges} />
							</div>
						) : null
					}

					<div className="branch--add">
						{noItemsComponent}
						<Link to="/branch/add/1" >
							<div className="add-item dashed">
								<span>Add a Branch <strong>+</strong></span>
							</div>
						</Link>
					</div>

					<div className="branches">
						{branchComponents}
					</div>

					<div className="branch--see-all">
						<Link to="/branches" >
							<button className="button--action button--action-filled">See all branches</button>
						</Link>
					</div>

				</div>
			</article>
		)
	}
};

SectionArticleBranches.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
	component: PropTypes.object
};

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    availableLanguages: state._languages.languages,
    availableMenus: state._menus && state._menus.menus || []
  };
};

export default connect(mapStateToProps)(SectionArticleBranches);