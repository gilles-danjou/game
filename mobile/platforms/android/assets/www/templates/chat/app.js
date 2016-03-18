
angular.module('starter', ['ionic', 'btford.socket-io', 'chat.controllers', 'chat.services'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.chats', {
    url: '/chats/{username}',
    params: { username: { value: null } },
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatCtrl'
      }
    }
  })

  .state('tab.users', {
      url: '/users',
      views: {
        'tab-users': {
          templateUrl: 'templates/tab-users.html',
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
//  $urlRouterProvider.otherwise('/tab/chats/');

});
