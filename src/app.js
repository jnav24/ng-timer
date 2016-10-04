var ng = require('angular');

ng.module('myTimer', [])

.controller('timer', function($scope, $interval, $log) {
	var hour = 0,
		minute = 0,
		second = 0,
		timer,
		zero = '0';

	$scope.description = '';
	$scope.hour = zero + 0;
	$scope.minute = zero + 0;
	$scope.rate = 25;
	$scope.second = zero + 0;
	$scope.title = '';
	$scope.title_error = 0;
	$scope.timer = [
		{
			title: 'Title',
			description: 'Description',
			time: 3.45
		},
		{
			title: 'Test 1',
			description: 'Description',
			time: 0.08
		}
	];
	$scope.timing = 1;

	var getTime = function(time) {
		if (time < 10) {
			return zero + time;
		}
		
		return time;
	};

	var addToTimerList = function() {
		if (second >= 30) {
			minute++;
		}

		var time = {
			title: $scope.title,
			description: $scope.description,
			time: hour + (Math.round((minute/60) * 100)/100)
		};

		$scope.timer.unshift(time);
	};

	var resetTimer = function() {
		hour = 0;
		minute = 0;
		second = 0;

		$scope.hour = zero + 0;
		$scope.minute = zero + 0;
		$scope.second = zero + 0;
	};

	$scope.getTotal = function() {
		var total = 0;

		ng.forEach($scope.timer, function(value, key) {
			total = total + value.time;
			$log.log(total);
		});

		// ng.forEach($scope.timer, function(value, key) {
		// 	var split = value.time.split('.');
		// 	total_minutes = total_minutes + parseInt(split[1], 10);

		// 	if (total_minutes >= 60) {
		// 		total_hours++;
		// 		total_minutes = total_minutes - 60;
		// 	}

		// 	total_hours = total_hours + parseInt(split[0], 10);

		// 	$log.log(value.time);
		// });

		return Math.round(total*100)/100;
	};

	$scope.isError = function() {
		if ($scope.title.trim() == '') {
			$scope.title_error = 1;
		}
		else {
			$scope.title_error = 0;
		}
	};

	$scope.startTimer = function($event) {
		$event.preventDefault();
		if ( ng.isDefined(timer) ) {
			return;
		}

		if ($scope.title.trim() == '') {
			$scope.title_error = 1;
			return;
		}

		$scope.timing = 0;

		timer = $interval(function() {
			second = second + 1;

			if (second > 59) {
				$scope.second = zero + 0;
				second = 0;
				
				minute++;
				$scope.minute = getTime(minute);

				if (minute > 59) {
					$scope.minute = zero + 0;
					minute = 0;

					hour++;
					$scope.hour = getTime(hour);
				}
			}
			$scope.second = getTime(second);
		}, 1000);
	};

	$scope.stopTimer = function($event) {
		$event.preventDefault();
		if ( ng.isDefined(timer) ) {
			$interval.cancel(timer);
			$scope.timing = 1;
			addToTimerList();
			resetTimer();
			timer = undefined;
		}
	};
})