import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Navbar from './Navbar';
import PageContent from './PageContent';

let createHandlers = (ctx) => {
  let onMenusFetched = (obj) => {
    console.log('menus fetched!');

    let menus = obj;

    ctx.setState({
      component: {
        type: 'menu',
        menus: menus
      }
    });
  };

  let onProfileFetched = (obj) => {
    console.log('profile fetched!');

    let profile = obj;

    ctx.setState({
      branches: profile.branches
    });
  };

  return {
    onMenusFetched,
    onProfileFetched
  };
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {},
      branches: []
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getMenus(this.handlers.onMenusFetched));
    this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
  }

  render () {
    const profile = (this.props.profile) ? this.props.profile : {};

    const branchRoot = (this.state.branches && this.state.branches.length > 0) ? this.state.branches.find(branch => {
      return branch.HasHeadquarters == 1;
    }) : null;

    if (branchRoot) {
      branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
        return contact.IsAdmin == 1;
      }) : null;
    }

    if (!profile.branches || profile.branches.length <= 0) {
      profile.branches = this.state.branches;
    }

    const menus = (this.state.component && this.state.component.menus && this.state.component.menus) ? this.state.component.menus : [];

    console.log(menus);

    const filteredMenus = (menus && menus.length > 0) ? menus.reduce((prev, current) => {
      return (prev.id > current.id) ? prev : current;
    }) : null;

    console.log(filteredMenus);

    const lastMenu = filteredMenus;

    const sections = [{
        type: "visits",
        title: "Dashboard",
        articles: [{
          type: "main",
          title: "Weekly Report - Unique Menu Visits",
          dateUpdate: {
            date: "26/04/2017 - 18:00",
            timezone: "GMT"
          },
          component: {
            type: "ChartPie",
            title: "",
            props: {
              description: {
                key: "visits",
                value: 3000,
                label: "Visits"
              },
              legends: [
                {
                  key: "visitsMobile",
                  value: 1850,
                  label: "Mobile",
                  color: "purple"
                },
                {
                  key: "visitsDesktop",
                  value: 1150,
                  label: "Desktop",
                  color: "red"
                }
              ]
            }
          }
        }]
    }, {
      type: "menus",
      title: "Latest Menus",
      articles: [{
        type: "main",
        title: "",
        component: /*
          type: "Menu",
          id: 2,
          title: "",
          props: {
            title: "Menu d'été",
            description: "Des saveurs estivales, provencales et fraîches",
            price: 30.99,
            dateUpdate: {
              date: "2017-06-15 10:47:58"
            },
            categories: [
              {
                id: 2,
                isCustom: false,
                title: "Starters",
                description: "First meal of the menu",
                meals: [
                  {
                    id: 1,
                    title: "Carpaccio de saumon au citron confit et aneth",
                    description: "Saumon sauvage de Norvège pêché à l'ours domestique suivant une technique ancestrale",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 2,
                    title: "Escargots à la Douzaine",
                    description: "Escargots et sa traditionelle sauce au beurre persillé",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 3,
                    title: "Pâté en croûte maison",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  }
                ]
              },
              {
                id: 3,
                isCustom: false,
                title: "Mains",
                description: "Main meal of the menu",
                meals: [
                  {
                    id: 4,
                    title: "Boeuf bourguignon",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 5,
                    title: "Coq au vin",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 6,
                    title: "Escalope de poulet et sa julienne de légumes",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  }
                ]
              },
              {
                id: 4,
                isCustom: false,
                title: "Desserts",
                description: "last meal of the menu",
                meals: [
                  {
                    id: 7,
                    title: "Charlotte aux framboises maison",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 8,
                    title: "Eclair à la pistache, éclats de noix de coco",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  },
                  {
                    id: 9,
                    title: "Salade de fruits frais",
                    description: "",
                    enableDetails: false,
                    detail: {}
                  }
                ]
              }
            ]
          }
        }

        */{
          type: "Menu",
          id: 2,
          title: "",
          props: filteredMenus
        }
      }]
    }];
    const asideType = 'plan';

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
    menu: state._menu.menu,
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(Dashboard);
