var ng = require('angular');

ng.module('myTimer', [])

.controller('timer', function($scope, $interval, $filter, $log) {
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
			title: 'Sample Title',
			description: 'Sample Description',
			start_time: new Date().getTime(),
			end_time: new Date().getTime() + (2*40*60*1000),
			time: 0
		}
	];
	$scope.show_start_timer = 1;
	$scope.edit_mode = 0;

	var getMins = function(mins) {
		return (Math.round((mins/60) * 100)/100);
	};

	var getTime = function(time) {
		if (time < 10) {
			return zero + time;
		}
		
		return time;
	};

	var addToTimerList = function() {
		var time = {
			title: $scope.title,
			description: $scope.description,
			start_time: new Date().getTime(),
			end_time: new Date().getTime(),
			time: 0
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

	var updateEndTime = function() {
		$scope.timer[0].end_time = new Date().getTime();
	};

	$scope.calcHours = function(index) {
		if ($scope.timer[index].time > 0) {
			return $scope.timer[index].time;
		}

		var start = $scope.timer[index].start_time,
			end = $scope.timer[index].end_time,
			calc_hour = new Date(end).getHours() - new Date(start).getHours();
			calc_min = new Date(end).getMinutes() - new Date(start).getMinutes();

		$scope.timer[index].time = calc_hour + getMins(calc_min);
		return $scope.timer[index].time;
	};

	$scope.getTotal = function() {
		var total = 0;

		ng.forEach($scope.timer, function(value, key) {
			total = total + value.time;
			$log.log(total);
		});

		return Math.round(total*100)/100;
	};

	$scope.modeEdit = function() {
		$scope.edit_mode = !$scope.edit_mode;
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

		$scope.show_start_timer = 0;
		addToTimerList();

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
			$scope.show_start_timer = 1;
			updateEndTime();
			resetTimer();
			timer = undefined;
		}
	};
})