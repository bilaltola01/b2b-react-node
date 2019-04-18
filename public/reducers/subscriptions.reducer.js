
var initialSubscriptionsState = {
  list: [
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
};

export function _subscriptions(state = initialSubscriptionsState, action) {
  switch (action.type) {
    default:
      return state
  }
}