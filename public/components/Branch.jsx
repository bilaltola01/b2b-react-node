import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Navbar from './Navbar';
import PageContent from './PageContent';

let createHandlers = (ctx) => {
  let onProfileFetched = (obj) => {
    console.log('profile fetched!');

    let profile = obj;

    ctx.setState({
      branches: profile.branches
    });
  };

  return {
    onProfileFetched
  };
};

class Branch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branches: []
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
  }

  render () {
    const { action, id } = this.props.match.params;
    const actionType = (typeof this.props.match.params.action !== 'undefined') ? 'branch-' + action : 'branch';

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

    console.log(branchRoot);

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
        title: "Branch " + id,
        articles: [{
          type: "branches",
          title: "Branch " + id,
          component: {
            id: id,
            type: "Branches",
            title: "",
            props: profile
          }
        }, {
          type: "menus",
          title: "Branch Menus",
          component: {
            type: "Menus",
            title: "",
            props: {
              menus: [
              /*
                {
                  id: 1,
                  title: "Menu du jour",
                  description: "Un menu de saison, préparé avec amour par notre chef",
                  price: 25.99,
                  dateUpdate: {
                    date: "2017-06-15 10:47:50"
                  }
                },*/
                {
                  id: 2,
                  title: "Menu d'été",
                  description: "Des saveurs estivales, provencales et fraîches",
                  price: 30.99,
                  dateUpdate: {
                    date: "2017-06-15 10:47:58"
                  },
                  translations: [
                    {
                      id: 1,
                      key: "title",
                      value: {
                        origin: "Menu d'été",
                        translated: "Summer menu"
                      },
                      language: {
                        id: 1,
                        code: "de",
                        codeFull: "de-CH",
                        title: "Swiss_German",
                        name: "German (Switzerland)",
                        flag: {

                        }
                      }
                    }
                  ],
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
              ],
              currency: {
                id: 2,
                name: "Sterling Pound",
                nameShort: "GBP",
                symbol: "£"
              }
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
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(Branch);
