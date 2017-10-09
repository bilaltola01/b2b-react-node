import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Navbar from './Navbar';
import PageContent from './PageContent';

let createHandlers = (ctx) => {
  let onMenuTranslationsFetched = (obj) => {
    console.log('menu translations fetched!');

    let translations = obj;

    ctx.setState({
      component: {
        type: 'menu',
        translations: translations
      }
    });
  };

  return {
    onMenuTranslationsFetched
  };
};

class TranslationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {}
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getMenuTranslations(this.handlers.onMenuTranslationsFetched));
  }

  render () {
    const action = this.props.match.params.action;

    const translations = (this.state.component && this.state.component.translations && this.state.component.translations) ? this.state.component.translations : [];

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


    let sections = [{
        type: "branches",
        title: "All Translations",
        articles: [{
        type: "translations",
        title: "Translations",
        component: {
          type: "Translations",
          id: 2,
          title: "",
          props: {
            translations: translations
          }
        }
      }]
    }];

    const asideType = 'plan';


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
    menu: state._menu.menu
  }
};

export default connect(mapStateToProps)(TranslationsPage);
