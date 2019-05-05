import React, { Component, PropTypes } from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from "../CheckoutForm";
import { connect } from 'react-redux';
import * as actionCreators from '../../action-creators';

class DigitalMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false,
            trial: false
        }

        this.handleCheckout = this.handleCheckout.bind(this);
        this.handleTrialCheckout = this.handleTrialCheckout.bind(this);
    }

    handleCheckout() {
        this.setState({showForm: true})
    }

    handleTrialCheckout() {
        this.setState({showForm: true, trial: true})
    }

    render() {
        const { onClick, digitalMenuPlanCompleted, digitalMenuPlan, currencies } = this.props;
        const { showForm, trial } = this.state;
        let planCurrency = '$';

        if (digitalMenuPlanCompleted && digitalMenuPlan && currencies ) {
            currencies.map((currency, index) => {
                if (currency.NameShort.toLowerCase() === digitalMenuPlan.currency.toLowerCase()) {
                    planCurrency = currency.Symbol;
                }
            })
        }
        

        return (
            <div className="plan-wrapper">
                <div className="plan-text">
                    <div className="title">Go Digital</div>
                    <div className="body">Let your customers get the menu on their iPhone or Android smartphone!</div>

                    {showForm
                        ? (<StripeProvider apiKey="pk_test_Mjz2q28RCNDZsFA6Y783rrKq">
                            <Elements>
                                <CheckoutForm trial={trial}/>
                            </Elements>
                        </StripeProvider>)
                        : (<button style={{marginRight: 'auto'}} className="button--action button--action-shadow"
                                   onClick={this.handleTrialCheckout}>Get your 3 months free trial</button>)
                    }
                </div>
                {
                    !showForm && (
                        <div className="plan-banner">
                            <div className="plan-card active">
                                <div className="title">Digital Menu</div>
                                <div className="version">iOS & Android</div>
                                <div className="fee">Fixed annual fee</div>
                                <div className="price"><span>
                                    {planCurrency}{digitalMenuPlan && digitalMenuPlanCompleted ? digitalMenuPlan.amount/100 : 90}
                                </span><span className="period">/{digitalMenuPlan && digitalMenuPlanCompleted ? digitalMenuPlan.interval : "year"}</span></div>
                                <div className="line"></div>
                                <div className="devices">Mobile & Tablet</div>
                                <div className="description">No limitations on branches and menus</div>
                                <div className="plan-button" style={{marginTop: 30}} onClick={this.handleCheckout}>Get started</div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
};

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    digitalMenuPlan: state._subscriptions.digitalMenuPlan,
    digitalMenuPlanCompleted: state._subscriptions.digitalMenuPlanCompleted,
    currencies: state._currencies.currencies
  }
};

export default  connect(mapStateToProps)(DigitalMenu);