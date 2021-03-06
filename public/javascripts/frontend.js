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
	//format money
	Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 	};

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
			var updatedIncomingpnl = 0;
			var updatedTradingpnl = 0;
			var updatedGrossexp = 0;
			var updatedLongpos = 0;
			var updatedShortpos = 0;
			var updatedBeta = 0;
			//add all the variables. These are the variables that will be displayed
			for(j=0; j<updatedLen; j++){

				updatedIncomingpnl += $scope.updated[j].incomingpnl;
				updatedIncomingpnl = parseFloat(updatedIncomingpnl).toFixed(2);
				$rootScope.updatedIncomingpnl = updatedIncomingpnl.formatMoney(2);
				console($rootScope.updatedIncomingpnl);

				updatedTradingpnl += $scope.updated[j].tradingpnl;
				$rootScope.updatedTradingpnl = updatedTradingpnl;
				$rootScope.updatedTradingpnl = parseFloat($rootScope.updatedTradingpnl).toFixed(2);
				$rootScope.updatedTradingpnl = $rootScope.updatedTradingpnl.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

				updatedGrossexp += $scope.updated[j].grossexp;
				$rootScope.updatedGrossexp = updatedGrossexp;
				$rootScope.updatedGrossexp = parseFloat($rootScope.updatedGrossexp).toFixed(2);
				$rootScope.updatedTradingpnl = $rootScope.updatedTradingpnl.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

				updatedLongpos += $scope.updated[j].longpos;
				$rootScope.updatedLongpos = updatedLongpos;
				$rootScope.updatedLongpos = parseFloat($rootScope.updatedLongpos).toFixed(2);
				$rootScope.updatedLongpos = $rootScope.updatedLongpos.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

				updatedShortpos += $scope.updated[j].shortpos;
				$rootScope.updatedShortpos = updatedShortpos;
				$rootScope.updatedShortpos = parseFloat($rootScope.updatedShortpos).toFixed(2);
				$rootScope.updatedShortpos = $rootScope.updatedShortpos.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

				
			}


			//loop to calculate beta
			for(k = 0;k<updatedLen; k++){
				//caculate beta using a variable called betaWeight;
				// console.log('Total grossexp is ' + updatedGrossexp + ' and grossexp for ' + $scope.updated[k].user + ' is ' + $scope.updated[k].grossexp);
				var weight = $scope.updated[k].grossexp/updatedGrossexp;
				var weightedBeta = $scope.updated[k].ptfbeta * weight;
				// console.log('betaWeight for ' + $scope.updated[k].user + ' is ' + weight);

				console.log('Current Beta is ' + updatedBeta + ': Adding weightedBeta for ' + $scope.updated[k].user + ' which is ' + weightedBeta)
				updatedBeta += weightedBeta;
				$rootScope.updatedBeta = updatedBeta;
				$rootScope.updatedBeta = parseFloat($rootScope.updatedBeta).toFixed(2); 

			}
			var updatedPnl = updatedTradingpnl + updatedIncomingpnl;
			$rootScope.updatedPnl = updatedPnl;
			$rootScope.updatedPnl = parseFloat($rootScope.updatedPnl).toFixed(2); 

			},function(err){throw err});
		},5000);


})

.controller('sectorsController', function($scope,$rootScope,$http,$interval){
	
})






























