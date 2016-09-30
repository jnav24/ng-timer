var ng = require('angular');

ng.module('myTimer', [])

.controller('timer', function($scope, $interval, $log) {
	var hour = 0,
		minute = 0,
		second = 0,
		timer,
		zero = '0';

	$scope.hour = zero + 0;
	$scope.minute = zero + 0;
	$scope.second = zero + 0;

	var getTime = function(time) {
		if (time < 10) {
			return zero + time;
		}
		
		return time;
	};

	$scope.startTimer = function() {
		if ( ng.isDefined(timer) ) {
			return;
		}

		timer = $interval(function() {
			second = second + 1;

			if (second > 10) {
				$scope.second = zero + 1;
				second = 1;
				
				minute++;
				$scope.minute = getTime(minute);

				if (minute > 2) {
					$scope.minute = zero + 0;
					minute = 0;

					hour++;
					$scope.hour = getTime(hour);
				}
			}
			$scope.second = getTime(second);
		}, 1000);
	};

	$scope.stopTimer = function() {
		if ( ng.isDefined(timer) ) {
			$interval.cancel(timer);
		}
	};
})