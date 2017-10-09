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

class Profile extends Component {
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
    const action = this.props.match.params.action;
    const profileType = (typeof this.props.match.params.action !== 'undefined') ? 'profile-' + action : 'profile';

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
    }; /*{
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
    };*/

    console.log(company);

    const sections = [{
        type: profileType,
        title: "Profile",
        articles: [{
          type: "company",
          title: "Cafe Mediterranean",
          component: {
            type: "Company",
            title: "",
            props: company
          }
        }, {
          type: "branches",
          title: "Branches",
          component: {
            type: "Branches",
            title: "",
            props: profile/*{
              branches: [
                {
                  id: 3,
                  name: "Branch West America",
                  address: "254 Santa Monica Boulevard",
                  city: "Los Angeles",
                  zipcode: "10777",
                  country: "USA",
                  email: "contact.westamerica@acme.com",
                  hasHeadquarters: true,

                  contacts: [
                    {
                      name: {
                        first: "Marla",
                        last: "Moran"
                      },
                      avatar: {
                        imgPath: 'assets/images/avatar-admin@2x.png',
                        altDesc: 'Image of Marla Moran'
                      },
                      tel: '+63-917-842-5222',
                      email: 'marla@thecafemediterranean.com'
                    }
                  ],
                  images: [
                    {
                      id: 1,
                      imgPath: "http://placekitten.com/640/480",
                      altDesc: "Wonderful kitty"
                    },
                    {
                      id: 2,
                      imgPath: "http://placekitten.com/420/280",
                      altDesc: "Wonderful kitty"
                    }
                  ],
                  languages: [
                    {
                      id: 1,
                      code: "de",
                      codeFull: "de-CH",
                      title: "Swiss_German",
                      name: "German (Switzerland)",
                      flag: {
                        id: 1,
                        title: "Germany Flag",
                        imgPath: "",
                        altDesc: "Image of the Germany flag"
                      }
                    }
                  ],
                  cuisines: [
                    {
                      id: 1,
                      title: "French",
                      description: "Traditional French food, Confit de Canard, Boeuf Bourguignon..."
                    }
                  ],
                  currency: {
                    id: 2,
                    name: "Sterling Pound",
                    nameShort: "GBP",
                    symbol: "£"
                  }
                },
                {
                  id: 4,
                  name: "Branch East America",
                  address: "254 Santa Monica Boulevard",
                  city: "New York",
                  zipcode: "10777",
                  country: "USA",
                  email: "contact.westamerica@acme.com",
                  hasHeadquarters: true,

                  contacts: [
                    {
                      name: {
                        first: "Marla",
                        last: "Moran"
                      },
                      avatar: {
                        imgPath: 'assets/images/avatar-admin@2x.png',
                        altDesc: 'Image of Marla Moran'
                      },
                      tel: '+63-917-842-5222',
                      email: 'marla@thecafemediterranean.com'
                    }
                  ],
                  images: [
                    {
                      id: 1,
                      imgPath: "http://placekitten.com/640/480",
                      altDesc: "Wonderful kitty"
                    },
                    {
                      id: 2,
                      imgPath: "http://placekitten.com/420/280",
                      altDesc: "Wonderful kitty"
                    }
                  ],
                  languages: [
                    {
                      id: 1,
                      code: "de",
                      codeFull: "de-CH",
                      title: "Swiss_German",
                      name: "German (Switzerland)",
                      flag: {
                        id: 1,
                        title: "Germany Flag",
                        imgPath: "",
                        altDesc: "Image of the Germany flag"
                      }
                    }
                  ],
                  cuisines: [
                    {
                      id: 1,
                      title: "French",
                      description: "Traditional French food, Confit de Canard, Boeuf Bourguignon..."
                    }
                  ],
                  currency: {
                    id: 2,
                    name: "Sterling Pound",
                    nameShort: "GBP",
                    symbol: "£"
                  }
                }
              ],
            }*/
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

export default connect(mapStateToProps)(Profile);
