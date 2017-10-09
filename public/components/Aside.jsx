import React, { Component, PropTypes } from 'react';

import AsidePlan from './AsidePlan';
import AsidePreview from './AsidePreview';

class Aside extends Component {
	render () {
		const { type } = this.props;

		const asideComponent = () => {
			switch(type) {
				case 'plan':
					return <AsidePlan />
				case 'preview':
					return <AsidePreview save={true} />
				case 'preview-nosave':
					return <AsidePreview save={false} />
				default:
					return <AsidePlan />
			}
		};

		return asideComponent();
	}
};

Aside.propTypes = {
	type: PropTypes.string
};

export default Aside;