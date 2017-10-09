import React, { Component, PropTypes } from 'react';

class ContactImage extends Component {
	render() {
		const { imgPath, altDesc } = this.props;

		return (
			<img src={imgPath} alt={altDesc} />
		)
	}
};

ContactImage.propTypes = {
	imgPath: PropTypes.string,
	altDesc: PropTypes.string
};

export default ContactImage;