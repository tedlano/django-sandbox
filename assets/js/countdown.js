$(document).ready(function() {

	// Create new jQuery function to handle countdown
	(function($) {
		$.fn.countdown = function(endDate) {
			var _this = $(this);	

			// Used to add leading zero if number has less than 1 character
			function addLeadZero(num){
				if (num.toString().length < 2){
					num = "0" + num
				}
				return num
			}

			// Clears the interval timer (stops countdown), and displays alert message for new year
			function endCountdownAlert(){
				clearInterval(interval);
				alert('Happy New Year!');
			}

			// Gets amount of time left between now and specified end date
			function getCounterData(endDate){
		  		var endDate_local = Date.parse(endDate); //+ (new Date()).getTimezoneOffset()*60*1000;
		  		var t = endDate_local - Date.parse(new Date());
		  		var days = "00";
		  		var hours = "00";
		  		var minutes = "00";
		  		var seconds = "00"

		  		// Don't want the countdown displaying negative numbers if endDate has already passed
		  		if (t >= 1000){
			  		days = addLeadZero(Math.floor( t / (1000*60*60*24) ));
			  		hours = addLeadZero( Math.floor( (t / (1000*60*60)) % 24 ) );
			  		minutes = addLeadZero( Math.floor( (t / (1000*60)) % 60 ) );
			  		seconds = addLeadZero( Math.floor( (t / 1000) % 60) );
		  		}

				return {
			  		'time': t,
			  		'days': days,
			    	'hours': hours,
			    	'minutes': minutes,
			    	'seconds': seconds
			  	}
			}

			// Set countdown display
			function updateCountdown(endDate) {
				var countData = getCounterData(endDate);

				_this.find(".days").text(countData.days);
				_this.find(".hours").text(countData.hours);
				_this.find(".minutes").text(countData.minutes);
				_this.find(".seconds").text(countData.seconds);

				// if less than 1000 milliseconds, end countdown
				if (countData.time < 1000){
		  			endCountdownAlert();
		  		}
			}
			
			// Set interval, run updateCountdown every second until specified endDate
			interval = setInterval(updateCountdown, 1000, endDate);

			//Return the element so that jQuery chaining can be done
			return _this;
		}
	}) (jQuery);

	// Run countdown function
	$("#countdown").countdown("2016/04/08 00:00:00");

});