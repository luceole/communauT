'use strict';
angular.module('testApp').controller('NavbarCtrl', function ($scope, $location, Auth) {
  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.isAdmin_grp = Auth.isAdmin_grp;
  $scope.isActif = Auth.isActif;
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.logout = function () {
    Auth.logout();
    $location.path('/login');
  };

  $scope.isActive = function (route) {
    return route === $location.path();
  };

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function (open) {};

  $scope.toggleDropdown = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
});
