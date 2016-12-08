'use strict';

describe('Controller: EvenementCtrl', function () {

  // load the controller's module
  beforeEach(module('communauT'));

  var EvenementCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EvenementCtrl = $controller('EvenementCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
