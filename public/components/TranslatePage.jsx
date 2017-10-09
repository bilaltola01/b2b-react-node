import React, { Component, PropTypes } from 'react';

import Navbar from './Navbar';
import PageContent from './PageContent';

class TranslatePage extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { component } = this.props.match.params;
    const actionType = (typeof component !== 'undefined') ? 'translate-menu' : 'translate';

    const type = (typeof this.props.location.state.component !== 'undefined') ? this.props.location.state.component.type : '';
    const obj = (typeof this.props.location.state.component !== 'undefined') ? this.props.location.state.component.obj : '';

    const company = {
        name: 'Cafe Mediterranean',
        description: '',
        logo: {
          imgPath: 'assets/images/logo-cafe-med-white.png',
          altDesc: 'The Cafe Mediterranean Logo'
        },
        website: 'http://thecafemediterranean.com',
        tel: '+63-917-842-5222',
        email: 'contact@thecafemediterranean.com',
        social: {
          twitter: 'https://twitter.com/thecafemediterranean',
          facebook: 'https://facebook.com/thecafemediterranean',
          instagram: 'https://instagram.com/thecafemediterranean'
        },
        branchRoot: {
          contact: {
            name: {
              first: 'Marla',
              last: 'Moran'
            },
            avatar: {
              imgPath: 'assets/images/avatar-admin@2x.png',
              altDesc: 'Image of Marla Moran'
            },
            tel: '+63-917-842-5222',
            email: 'marla@thecafemediterranean.com'
          }
        }
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

export default TranslatePage;
