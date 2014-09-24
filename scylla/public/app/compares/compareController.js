define([
    "scyllaApp",
    "toastr",
    "services/comparesService",
    "compares/dialogs/compareEditor",
    "compares/dialogs/deleteCompare"
], function(
    scyllaApp,
    toastr,
    TheComparesService,
    TheCompareEditor,
    TheCompareDeleter
    ){
    'use strict';

    return scyllaApp.controller("CompareController", function($scope, $modal, $log, Header, ComparesService) {
        Header.setFirstLevelNavId("comparesNav");

        $scope.compares = [];

        $scope.getAllCompares = function(){
            $scope.isProcessing = true;
            ComparesService.list()
                .then(function(compares){
                    $scope.isProcessing = false;
                    $scope.compares = compares;
                });
        };

        $scope.confirmDeleteCompare = function confirmDeleteCompare(compare) {
            var modalInstance = $modal.open({
                templateUrl: 'app/compares/dialogs/deleteCompare.html',
                controller: 'DialogDeleteCompare',
                resolve: {
                    compare: function() {
                        return compare;
                    }
                }
            });

            modalInstance.result.then(function (compare) {
                $scope.isProcessing = true;
                ComparesService.delete(compare)
                    .then(function() {
                        toastr.success("Compare deleted successfully");
                        $scope.compares.splice(
                            $scope.compares.indexOf(compare), 1
                        );
                        $scope.isProcessing = false;
                    });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.deleteResult = function deleteResult(resultId){
            $http.delete("/abcompare-results/" + resultId)
                .error(function(error){
                    console.error("Error Deleting AB Compare Result", resultId, error);
                })
        };

        $scope.showNew = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/compares/dialogs/compareEditor.html',
                controller: 'DialogCompareEditor',
                resolve: {
                    compare: function () {
                        return {
                            pageA:{name: "", url: "", cookie: null},
                            pageB:{name: "", url: "", cookie: null}
                        };
                    }, 
                    isNewCompare: function() {
                        return true;
                    }
                }
            });
             
            modalInstance.result.then(function (compare) {
                $scope.saveCompare(compare)
                    .then(function(newCompare){
                        $scope.isProcessing = true;
                        toastr.success("New Compare Created.<br>Now capturing snapshots and creating diff.");
                        $scope.executeCompare(newCompare)
                            .then(function() {
                                $scope.getCompareById(newCompare.id)
                                    .then(function(finishedCompare) {
                                        $scope.compares.push(finishedCompare);
                                        toastr.success("Snapshots and diff created");
                                        $scope.isProcessing = false;
                                    });
                            });

                    })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.saveCompare = function saveCompare(compare){
            $scope.isProcessing = true;
            return ComparesService.save(compare)
                .then(function(newCompare){
                    return newCompare;
                });
        };

        $scope.executeCompare = function executeCompare(compare){
            $scope.isProcessing = true;
            return ComparesService.executeCompare(compare)
                .then(function(newCompare) {
                    return newCompare;
                });
        };

        $scope.getCompareById = function getCompareById(compareId) {
            $scope.isProcessing = true;
            return ComparesService.get(compareId)
                .then(function(compareFromDatabase) {
                    return compareFromDatabase;
                });
        };

        $scope.getAllCompares();

    });
});