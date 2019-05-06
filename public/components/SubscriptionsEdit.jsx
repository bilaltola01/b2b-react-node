import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import * as DomUtils from '../shared/dom.utils';

import SubscriptionEdit from './SubscriptionEdit';
import LanguagePicker from './LanguagePicker';

let createHandlers = (ctx) => {
	let onAdd = (obj) => {
		let selectedSubscription;
		ctx.setState((prevState) => {
			const { subscriptions, selected } = ctx.props;
		
			if (subscriptions && subscriptions.length > 0 ) {
				subscriptions.map((subscription, index) => {
					if (subscription.id === obj.id) {
						selectedSubscription = subscription;
					}
				});
			}

			if (ctx.props.onChange && typeof ctx.props.onChange === 'function') {
				ctx.props.onChange('selectedSubscription', {data: selectedSubscription});
			}

			return {
				selectedSubscription
			}
		});
	};

	let onPickerBlur = (e) => {
		let select = e.target.querySelector('.select--styled.active');
		if (select) {
			DomUtils.toggleClass(select, 'active');
		}
	};

	let onRemove = (obj) => {
		ctx.setState((prevState) => {;

			ctx.props.onChange('selectedSubscription', {data: null});

			return {
				selectedSubscription: null
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
		let id = e.target.getAttribute('data-id');
		let target = e.target.parentNode.previousElementSibling;
		target.setAttribute('data-rel', rel);
		target.textContent = text;

		DomUtils.toggleClass(target, 'active');

		// Then add the new menu
		onAdd({
			id,
			rel,
			name: text
		});
	};

	return {
		onAdd,
		onPickerBlur,
		onRemove,
		onPickerClick,
		onPickerItemClick
	};
};

class SubsriptionsEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedSubscription: null
		};
		this.handlers = createHandlers(this);
	}

	componentDidMount() {
		const { subscriptions, selected } = this.props;
		
		if (subscriptions && subscriptions.length > 0 && selected) {
			subscriptions.map((subscription, index) => {
				if (subscription.id === selected) {
					const selectedSubscription = subscription;
					this.setState({selectedSubscription})
				}
			});
		}
	}

	render() {
		const { menus, onChange, simple, subscriptions, selected } = this.props;
		const { selectedSubscription } = this.state;
		
		const obj = {
			type: "subscriptions",
			items: subscriptions
		};

		const subscriptionComponent = selectedSubscription ? (
			<span key={selectedSubscription.id}>
				<SubscriptionEdit id={selectedSubscription.id} name={selectedSubscription.metadata.title} onRemove={this.handlers.onRemove} key={selectedSubscription.id} />
			</span>
		) : null

		return (
			<div>
				{!simple ? <p className="menu--title">Subscription Package</p> : null}
				{subscriptionComponent}

				<div id="menu-branch-add" className="language--add">
                    {!simple ? <label>Add a subscription for this branch:</label> : null}
					<div id="branch-picker" className="language--picker">
						<LanguagePicker data={obj} onAdd={this.handlers.onAdd} onPickerBlur={this.handlers.onPickerBlur} onPickerClick={this.handlers.onPickerClick} onPickerItemClick={this.handlers.onPickerItemClick} />
                    </div>
				</div>
            </div>
		)
	}
};

SubsriptionsEdit.propTypes = {
  menus: PropTypes.array,
	onChange: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    profile: state._profile.profile,
  	subscriptions: state._subscriptions.multilingualMenuPlans,
		selected: state._subscriptions.selected
  };
};

export default connect(mapStateToProps)(SubsriptionsEdit);