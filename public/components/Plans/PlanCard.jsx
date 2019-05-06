import React, { Component, PropTypes } from 'react';

class PlanCard extends Component {
    
    render() {
        const { data = {}, active, current, onClick, onStart, currencies } = this.props;

        let planCurrency = '$';

        if (currencies ) {
            currencies.map((currency, index) => {
                if (currency.NameShort.toLowerCase() === data.currency.toLowerCase()) {
                    planCurrency = currency.Symbol;
                }
            })
        }

        return (
            <div className={`plan-card shadow ${active ? 'active' : ''} ${current ? 'current' : ''}`} onClick={onClick}>
                <div className="title">{data.metadata.title}</div>
                <div className="version"><img src={`assets/images/plan_${data.metadata.id}${active ? '_white' : ''}.png`} /></div>
                <div className="fee">Starting from</div>
                <div className="price"><span>{planCurrency}{data.amount/100}</span><span className="period">/{data.interval}</span></div>
                <div className="line"></div>
                <div className="devices">
                    <div>{data.metadata.words} words</div>
                    <div className="per-year">per {data.interval}</div>
                </div>
                <div className="plus"><img src={`assets/images/plus${active ? '_white' : ''}.png`} /></div>
                <div className="description">{data.metadata.languages} languages</div>
                <div className="plan-button" onClick={onStart}>Get started</div>
                <img className="current-sticker" src="assets/images/current_plan.png" />
            </div>
        )
    }
};

PlanCard.propTypes = {
    component: PropTypes.object
};

export default PlanCard;