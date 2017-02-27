app.controller('tradesController',function($scope,$interval,$http){

	$scope.portfolioNames = [];
	$http.get('/api').then(function(response){
			data = response.data;
			$scope.portfolios = data;

			var portArray = $scope.portfolios;
			var nameArray = [];
			var arrayLength = portArray.length;
			var check = 'defined';
			for(var i = 0; i < arrayLength; i++){

				var port = portArray[i]
				var portName = port.user;
				
				if (port.user === f){
					check = port.user;
				}
				nameArray.push(portName);
			}
			$scope.portfolioNames = nameArray;
			console.log(check);
		});

	$interval(function(){

		
		$http.get('/trades').then(function(response){
			var updatedTrades = []
			data = response.data;
			
			var tradesLen = data.length;
			for(i = 0; i < tradesLen; i++){
				if(data[i].user === f){
					updatedTrades.push(data[i]);
				}
			}
			$scope.data = updatedTrades;
		})
	}, 200)



})