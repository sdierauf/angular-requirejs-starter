define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('DialogPageEditor', function ($scope, $modalInstance, page) {


            $scope.page = page;

            $scope.ok = function () {
                $modalInstance.close($scope.page);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});