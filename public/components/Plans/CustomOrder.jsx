import React, { Component, PropTypes } from 'react';
import BranchMenusEdit from "../BranchMenusEdit";

class CustomOrder extends Component {
    render() {
        const { onClick, onChanges, availableMenus } = this.props;

        return (
            <div className="custom-plan-wrapper">
                <div className="custom-plan-text">
                    <div className="title">Need more than 2 000 words?</div>
                    <div className="body">Tell us how many words you need to translate or just choose one of your menus and we’ll create a custom offer for you!</div>
                    <div className="words">
                        <div className="content--edit">
                            <div className="edit--block">
                                <label className="label--edit">Number of words:</label>
                                <input className="input--edit" type="text" name="words" placeholder="2600..." onChange={(e) => onChanges('main', e)} />
                            </div>
                        </div>
                    </div>
                    <div style={{marginLeft: '-10px', marginBottom: 30}}>
                        <BranchMenusEdit simple menus={[]} availableCurrencies={availableMenus} onChange={onChanges} />
                    </div>
                    <div className="words">
                        <div className="content--edit">
                            <div className="edit--block">
                                <label className="label--edit">Comments:</label>
                                <textarea style={{height: 100}} className="input--edit" type="text" name="comments" placeholder="Any questions or comments?" onChange={(e) => onChanges('main', e)} ></textarea>
                            </div>
                        </div>
                    </div>
                    <button style={{marginRight: 'auto'}} className="notification button--action button--action-filled" onClick={onClick}>Get your 3 months free trial</button>
                </div>
                <div className="custom-plan-banner">
                    <div className="title">You custom offer:</div>
                    <div className="custom-plan-card">
                        <div className="desc">Fill in the form and in a few days your custom offer will wait for you here...</div>
                        <img src="assets/images/stars.png" />
                    </div>
                </div>
            </div>
        )
    }
};

export default CustomOrder;