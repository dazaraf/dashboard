var portfoliodata;

var app = angular.module('app',[]);

// -----
// Service
// -----

// .factory('pull', ['$http', function($http,$interval){

// 	r
// }])

// ------
// Controllers
// ------

app.controller('PnLController',function($scope,$rootScope,$http,$interval){
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

			// console.log('Before the loop');
			// console.log($scope.selection);
			// console.log($scope.updated);

			for(i=0; i<len; i++){

				if (_.contains($scope.selection,$scope.portfolios[i].user)) {
					$scope.updated.push($scope.portfolios[i]);
				}
			}

			// console.log('After the for loop');
			var updatedLen = $scope.updated.length;
			// console.log($scope.updated);
			// console.log(updatedLen);
			//initialize all the new variables
			$rootScope.updatedPnL = 0
			$rootScope.updatedIncomingpnl = 0;
			$rootScope.updatedTradingpnl = 0;
			$rootScope.updatedGrossexp = 0;
			$rootScope.updatedLongpos = 0;
			$rootScope.updatedShortpos = 0;
			$rootScope.updatedBeta = 0;
			var updatedIncomingpnl = 0;
			var updatedTradingpnl = 0;
			var updatedGrossexp = 0;
			var updatedLongpos = 0;
			var updatedShortpos = 0;
			var updatedBeta = 0;
			//add all the variables. These are the variables that will be displayed
			for(j=0; j<updatedLen; j++){

				updatedIncomingpnl += $scope.updated[j].incomingpnl;
				$rootScope.updatedIncomingpnl = updatedIncomingpnl.toFixed(2);
				$rootScope.updatedIncomingpnl = $rootScope.updatedIncomingpnl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				
				updatedTradingpnl += $scope.updated[j].tradingpnl;
				$rootScope.updatedTradingpnl = updatedTradingpnl.toFixed(2);
				$rootScope.updatedTradingpnl = $rootScope.updatedTradingpnl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				
				updatedGrossexp += $scope.updated[j].grossexp;
				$rootScope.updatedGrossexp = updatedGrossexp;
				$rootScope.updatedGrossexp = $rootScope.updatedGrossexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

				updatedLongpos += $scope.updated[j].longpos;
				$rootScope.updatedLongpos = updatedLongpos;
				$rootScope.updatedLongpos = $rootScope.updatedLongpos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

				updatedShortpos += $scope.updated[j].shortpos;
				$rootScope.updatedShortpos = updatedShortpos;
				$rootScope.updatedShortpos = $rootScope.updatedShortpos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
			}


			//loop to calculate beta
			for(k = 0;k<updatedLen; k++){
				//caculate beta using a variable called betaWeight;
				// console.log('Total grossexp is ' + updatedGrossexp + ' and grossexp for ' + $scope.updated[k].user + ' is ' + $scope.updated[k].grossexp);
				var weight = $scope.updated[k].grossexp/updatedGrossexp;
				var weightedBeta = $scope.updated[k].ptfbeta * weight;
				// console.log('betaWeight for ' + $scope.updated[k].user + ' is ' + weight);

				// console.log('Current Beta is ' + updatedBeta + ': Adding weightedBeta for ' + $scope.updated[k].user + ' which is ' + weightedBeta)
				updatedBeta += weightedBeta;
				$rootScope.updatedBeta = updatedBeta;
				$rootScope.updatedBeta = parseFloat($rootScope.updatedBeta).toFixed(2); 

			}
			updatedPnl = updatedTradingpnl + updatedIncomingpnl;
			updatedPnl = updatedPnl.toFixed(2);
			$rootScope.updatedPnl = updatedPnl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
			},function(err){throw err});
		},500);


		$interval(function(){

			$http.get('/sectorsApi').then(function(response){
				sectorsData = response.data;
				$scope.sectors = sectorsData;

				$scope.sectorsUpdated = [];
				var len = $scope.sectors.length;
				for(i=0; i<len; i++){

					if (_.contains($scope.selection,$scope.sectors[i].user)) {
						$scope.sectorsUpdated.push($scope.sectors[i]);
					}
				}

				// console.log('sectorsUpdated');
				// console.log($scope.sectorsUpdated);

				valueArray = new Array(12).fill(0);
				var updatedSectorsLength = $scope.sectorsUpdated.length;
				var chartData = []
				var obj = $scope.sectors[0];

				for(i = 0; i<updatedSectorsLength; i++){

					var currentObj = $scope.sectorsUpdated[i];
					// console.log('CurrentObj is now ' + currentObj[Object.keys(currentObj)[0]])
					for(j = 0; j<valueArray.length; j++){
						valueArray[j] += currentObj[Object.keys(currentObj)[j+1]];
						// console.log('The ' + j + 'th entry in valueArray is ' + valueArray[j]);
					}
				}
				for(k = 0; k<valueArray.length; k++){
					
					entry = {"sector": Object.keys(obj)[k+1], "exposure": valueArray[k]};
					chartData.push(entry);
				}
				// console.log(chartData);

				$scope.chartData = chartData;

			},function(err){throw err});

		},500);

});





























