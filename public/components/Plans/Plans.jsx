import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as actionCreators from '../../action-creators';
import Navbar from '../Navbar';
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import PlanCard from "./PlanCard";
import DigitalMenu from "./DigitalMenu";
import CustomOrder from "./CustomOrder";
const classNames = require('classnames');

const cards = [
    {
        id: 1,
        title: 'Degustation',
        icon: '',
        price: 90,
        words: 1000,
        languages: 2,
    },
    {
        id: 2,
        title: 'Menu du jour',
        icon: '',
        price: 119,
        words: 1500,
        languages: 2,
    },
    {
        id: 3,
        title: 'A la carte',
        icon: '',
        price: 144,
        words: 2000,
        languages: 2,
    },
]
class Plans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            current: 2
        };
        this.handleStart = this.handleStart.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
    }

    handleStart() {

    }

    handleClick(id) {
        this.setState({selected: id})
    }

    handleCustomOrder() {
    }

    render () {
        const { selected, current } = this.state;
        const action = this.props.match.params.action;
        const profileType = (typeof this.props.match.params.action !== 'undefined') ? 'profile-' + action : 'profile';

        const profile = (this.props.profile) ? this.props.profile : {};

        const branchRoot = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
            return branch.HasHeadquarters == 1;
        }) : null;

        if (branchRoot) {
            branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
                return contact.IsAdmin == 1;
            }) : null;
        }


        const company = {
            name: profile.Name,
            description: profile.Description,
            logo: {
                imgPath: profile.LogoPath,
                altDesc: profile.LogoAltDesc
            },
            website: profile.Website,
            tel: profile.Tel,
            email: profile.Email,
            social: {
                twitter: profile.Twitter,
                facebook: profile.Facebook,
                instagram: profile.Instagram,
                youtube: profile.Youtube
            },
            branchRoot: branchRoot
        };

        const asideType = 'plan';

        const classes = classNames(
            'content--section',
            'section--dashboard',
            'section--type-plans'
        );


        return (
            <div>
                <Navbar logo={company.logo} />
                <div className="content">
                    <PageHeader company={company} />

                    <div className="main-content">
                        <Aside type={asideType} />

                        <main className="main">
                            <section className={classes}>
                                <h1 className="content--title">Plans</h1>
                                    <Tabs>
                                        <TabList>
                                            <Tab>Digital Menu</Tab>
                                            <Tab>Multilingual digital menu</Tab>
                                            <Tab>Custom Order</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <DigitalMenu onClick={this.handleStart} />
                                        </TabPanel>
                                        <TabPanel>
                                            <div className="plan-wrapper">
                                                {cards.map((item, index) => {
                                                    return <PlanCard
                                                        key={item.id}
                                                        active={item.id === selected}
                                                        current={item.id === current}
                                                        data={item}
                                                        onClick={() => this.handleClick(item.id)}
                                                    />
                                                })}
                                            </div>
                                            <div className="notes">*5 months prepay in advance required on subscription</div>
                                        </TabPanel>
                                        <TabPanel>
                                            <CustomOrder onClick={this.handleCustomOrder} />
                                        </TabPanel>
                                    </Tabs>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
};


const mapStateToProps = (state) => {
    // console.log(state);
    return {
        profile: state._profile.profile
    }
};

export default connect(mapStateToProps)(Plans);
