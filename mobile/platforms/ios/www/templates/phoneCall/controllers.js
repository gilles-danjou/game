// Controller of menu dashboard page.
appControllers.controller('facetimeCtrl', ['$rootScope', '$scope', '$mdToast', function ($rootScope, $scope, $mdToast) {

  $rootScope.$watch('pnjs', function() {
    $scope.pnjs = $rootScope.pnjs;
    $scope.dialogs = $rootScope.dialogs;
    $scope.context = $rootScope.context;

  });

    //ShowToast for show toast when user press button.
    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    }; // End showToast.
  }]);
