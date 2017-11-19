import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Navbar from './Navbar';
import PageContent from './PageContent';

class TranslatePage extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { component } = this.props.match.params;
    const actionType = (typeof component !== 'undefined') ? 'translate-menu' : 'translate';

    const profile = (this.props.profile) ? this.props.profile : {};

    const branchRoot = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
      return branch.HasHeadquarters == 1;
    }) : null;

    if (branchRoot) {
      branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
        return contact.IsAdmin == 1;
      }) : null;
    }

    const type = (typeof this.props.location.state.component !== 'undefined') ? this.props.location.state.component.type : '';
    const obj = (typeof this.props.location.state.component !== 'undefined') ? this.props.location.state.component.obj : '';

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

    const sections = [{
        type: actionType,
        title: "Translate",
        articles: [{
          type: "translate",
          title: "Translate " + type,
          component: {
            type: "Alert",
            title: "",
            props: obj
          }
        }]
    }];

    const asideType = 'preview-nosave';


    return (
      <div>
        <Navbar logo={company.logo} />
        <PageContent sections={sections} asideType={asideType} company={company} />
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(TranslatePage);
