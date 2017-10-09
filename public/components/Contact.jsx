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


class Contact extends Component {
	render() {
		const { imgPath, altDesc, firstname, lastname, hasHeadquarters, tel, email } = this.props;

		const contactImage = <ContactImage imgPath={imgPath} altDesc={altDesc} />;

		return (
			<div className="branch--contact">
				<div className="contact--support global-padding-wrapper">
	                <div className="contact--support--header clearfix">
	                	{contactImage}

	                    <h2 className="contact--support--title">{firstname} {lastname}</h2>
	                </div>
	                <div className="contact--support--details">
	                	{tel &&
		                    <div className="contact--details">
		                        <h4 className="icon--contact icon--phone">Phone</h4>
		                        <p className="news--text">
		                            <a className="text-link" href={"tel:" + tel}>{tel}</a>
		                        </p>
		                    </div>
	                	}
	                    <div className="contact--details">
	                        <h4 className="icon--contact icon--mail">Mail</h4>
	                        <p className="news--text">
	                            <a className="text-link" href={"mailto:" + email}>{email}</a>
	                        </p>
	                    </div>
	                </div>
	            </div>
	        </div>
		)
	}
};

Contact.propTypes = {
	imgPath: PropTypes.string,
	altDesc: PropTypes.string,
	firstname: PropTypes.string,
	lastname: PropTypes.string,
	hasHeadquarters: PropTypes.number,
	email: PropTypes.string,
	tel: PropTypes.string
};

export default Contact;