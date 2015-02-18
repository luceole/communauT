'use strict';

angular.module('testApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
 $scope.myInit = function() {
        if (!$scope.user.uid ){$scope.user.uid=$scope.user.email;}
      };
    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          surname: $scope.user.surname,
          structure: $scope.user.structure,
          email: $scope.user.email,
          uid: $scope.user.uid,
          password: $scope.user.password,
          isactif: false
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  })
  .directive('equalsTo', [function () {
    return {
        restrict: 'A', // S'utilise uniquement en tant qu'attribut
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var check = function () {
                //var v1 = scope.ConfirmPassword;
                //var v2 = scope.user.password;
                //console.log("test "+v1 + " "+v2);
                return scope.ConfirmPassword === scope.user.password;
            };
            scope.$watch(check, function (isValid) {
                // Défini si le champ est valide
                control.$setValidity("equalsTo", isValid);
            });
        }
    };
}]);


