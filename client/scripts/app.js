'use strict';

var app = angular.module('fitMunk', [
  'fm.services',
  'fm.lobby',
  'fm.navbar',
  'fm.dashboard',
  'ui.router'
])
  
.config(function($stateProvider, $locationProvider) {
  $stateProvider
    .state('lobby',{
      url        : '/lobby',
      template   : '<fm-lobby></fm-lobby>',
      controller : 'LobbyCtrl'
    })
    .state('dashboard',{
      url        : '/dashboard',
      template   : '<fm-dashboard></fm-dashboard>',
      controller : 'DashboardCtrl'
    })
});