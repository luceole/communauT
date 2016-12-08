'use strict';

describe('Controller: AdminpoolCtrl', function () {

  // load the controller's module
  beforeEach(module('communauT'));

  var AdminpoolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminpoolCtrl = $controller('AdminpoolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
