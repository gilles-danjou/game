var appControllers = angular.module('starter.controllers', []); // Use for all controller of application.
var appServices = angular.module('starter.services', ['ngResource']);// Use for all service of application.

appServices .factory('mySharedService', function($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});
