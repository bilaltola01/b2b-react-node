import React, { Component, PropTypes } from 'react';

class DigitalMenu extends Component {
    render() {
        const { onClick } = this.props;

        return (
            <div className="plan-wrapper">
                <div className="plan-text">
                    <div className="title">Go Digital</div>
                    <div className="body">Let your customers get the menu on their iPhone or Android smartphone!</div>
                    <button style={{marginRight: 'auto'}} className="button--action button--action-shadow" onClick={onClick}>Get your 3 months free trial</button>
                </div>
                <div className="plan-banner">
                    <div className="plan-card active">
                        <div className="title">Digital Menu</div>
                        <div className="version">iOS & Android</div>
                        <div className="fee">Fixed annual fee</div>
                        <div className="price"><span>$90</span><span className="period">/yr</span></div>
                        <div className="line"></div>
                        <div className="devices">Mobile & Tablet</div>
                        <div className="description">No limitations on branches and menus</div>
                        <div className="plan-button" style={{marginTop: 30}}>Get started</div>
                    </div>
                </div>
            </div>
        )
    }
};

export default DigitalMenu;