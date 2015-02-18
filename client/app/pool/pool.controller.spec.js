'use strict';

describe('Controller: PoolCtrl', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var PoolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PoolCtrl = $controller('PoolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
