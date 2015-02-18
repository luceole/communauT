'use strict';

describe('Controller: AdmingroupCtrl', function() {

  // load the controller's module
  beforeEach(module('testApp'));

  var AdmingroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    AdmingroupCtrl = $controller('AdmingroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});