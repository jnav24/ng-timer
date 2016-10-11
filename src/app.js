var ng = require('angular');
var ng_datepicker = require('angular-datepicker');

ng.module('myTimer', ['datePicker'])

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
	$scope.set_mode_edit = {};
	$scope.show_start_timer = 1;
	$scope.title = '';
	$scope.title_error = 0;
	$scope.timer = [ 
		{
			title: 'Sample Title',
			description: 'Sample Description',
			start_time: new Date().getTime(),
			end_time: new Date().getTime() + (2*40*60*1000),
			time: 0.00
		},
		{
			title: 'Sample Title',
			description: 'Sample Description',
			start_time: new Date().getTime(),
			end_time: new Date().getTime() + (2*40*60*1000),
			time: 0.00
		}
	];
	$scope.test_date = new Date().getTime();

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
			time: 0.00
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
		$scope.timer[index].start_time = new Date($scope.timer[index].start_time).getTime();
		$scope.timer[index].end_time = new Date($scope.timer[index].end_time).getTime();

		if ($scope.timer[index].start_time > $scope.timer[index].end_time) {
			return 0.00;
		}

		var start_time = new Date($scope.timer[index].start_time).getTime(),
			end_time = new Date($scope.timer[index].end_time).getTime(),
			exact_hours = Math.abs(end_time - start_time)/(60*60*1000);

		$scope.timer[index].time = parseFloat(exact_hours).toFixed(2);
		return $scope.timer[index].time;
	};

	$scope.getTotal = function() {
		var total = 0;

		ng.forEach($scope.timer, function(value, key) {
			value.time = parseFloat(value.time);
			total = total + value.time;
		});

		return Math.round(total*100)/100;
	};

	$scope.modeSave = function($event) {
		$scope.modeEdit($event);
	};

	$scope.isError = function() {
		if ($scope.title.trim() == '') {
			$scope.title_error = 1;
		}
		else {
			$scope.title_error = 0;
		}
	};

	$scope.removeTime = function($event, $index) {
		$event.preventDefault();
		$scope.timer.splice($index, 1);
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


	$scope.setModeEdit = function($index) {
		if (typeof $scope.set_mode_edit[$index] == 'undefined') {
			$scope.set_mode_edit[$index] = 0;
			return $scope.set_mode_edit[$index];
		}

		return $scope.set_mode_edit[$index];
	};

	$scope.getModeEdit = function($event, $index) {
		$event.preventDefault();
		return $scope.set_mode_edit[$index] = !$scope.set_mode_edit[$index];
	};
})