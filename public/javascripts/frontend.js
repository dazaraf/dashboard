var portfoliodata;

angular.module('app',[])

// -----
// Service
// -----

// .factory('pull', ['$http', function($http,$interval){

// 	r
// }])

// ------
// Controllers
// ------

.controller('PnLController',function($scope,$rootScope,$http,$interval){
	//load portfolio names into an array
	$scope.portfolioNames = [];
	$http.get('/api').then(function(response){
			data = response.data;
			$scope.portfolios = data;

			var portArray = $scope.portfolios;
			var nameArray = [];
			var arrayLength = portArray.length;
			for(var i = 0; i < arrayLength; i++){

				var port = portArray[i]
				var portName = port.user;
				nameArray.push(portName);
			}
			$scope.portfolioNames = nameArray;
			
		})

	//create an array of selected portfolionames.
	$scope.selection = [];
    $scope.toggleSelection = function toggleSelection(name) {
      var idx = $scope.selection.indexOf(name);
      
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      
      // is newly selected
      else {
        $scope.selection.push(name);
      }

    };

	//keep querying in realtime
	$interval(function(){

		$http.get('/api').then(function(response){
			data = response.data;
			$scope.portfolios = data;

			var len = $scope.portfolios.length;
			$scope.updated = [];

			console.log('Before the loop');
			console.log($scope.selection);
			console.log($scope.updated);

			for(i=0; i<len; i++){

				console.log('In loop');
				console.log($scope.portfolios[i].user);
				console.log('');
				if (_.contains($scope.selection,$scope.portfolios[i].user)) {
					console.log($scope.portfolios[i].user + ' is selected!');
					$scope.updated.push($scope.portfolios[i]);
				}
			}

			var updatedLen = $scope.updated.length;
			$rootScope.updatedIncomingpnl = 0;
			for(j=0; j<updatedLen; j++){

				$rootScope.updatedIncomingpnl = $rootScope.updatedIncomingpnl + $scope.updated[j].incomingpnl;
			}

			console.log('After the for loop');
			console.log($rootScope.updatedIncomingpnl);

			},function(err){throw err});
		},5000);


});






























