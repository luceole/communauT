'use strict';

describe('Controller: AdminpollCtrl', function () {

  // load the controller's module
  beforeEach(module('communauT'));

  var AdminpollCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminpollCtrl = $controller('AdminpollCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
