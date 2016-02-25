$( window ).load( function() {
    
    var num;                // Random number to guesss
    var correct = 0;        // Number of correct guesses
    var wrong = 0;          // Number of wrong guesses
    var streak = 0;         // Number of correct guesses in a row
    var numDigits = 3;      // Default number of digits
    var lockEnter = false;  // Prevent double-click submit
    var cnDict = {          // Dictionary to change numbers into Chinese Characters
        "0": "零",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九"
    };
    
    // responsiveVoice requires responsivevoice.js
    function sayNumber(){
        responsiveVoice.speak(num.toString(), "Chinese Female");
    }
    
    function initNumber() {
        num = Math.floor(Math.random() * Math.pow(10,9));
        num=parseInt(num.toString().slice(0, numDigits));
        console.log(num);

        sayNumber();
    }
    
    function checkGuess(ele){
        var guess = ele.val();
        
        // If blank entry, highlight in yellow
		if(guess == null || guess == ""){
		    ele.removeClass("correct wrong").addClass("warning");
		    lockEnter = false;
		    
		} else {
            var status = (guess == num ? "correct" : "wrong");
            ele.removeClass("correct wrong warning").addClass(status);
            
            // If guess is correct
            if(status == "correct"){
                correct++;
                streak++;
                $('#results-text')[0].innerHTML = "Correct: " + correct + 
                                                  ", Wrong: " + wrong + 
                                                  ", Streak: " + streak;
                setTimeout(function() {
                    ele.removeClass(status);
                    ele.val(null);
                    initNumber();
                    lockEnter = false;
                 }, 1000);
            
            // If guess is wrong   
            } else {
                wrong++;
                streak = 0;
                $('#results-text')[0].innerHTML = "Correct: " + correct + 
                                                  ", Wrong: " + wrong + 
                                                  ", Streak: " + streak;
                sayNumber();
                lockEnter = false;
            }
		}
    }
    
    function toggleNumDisplay(dispId){
        $('#number-entry-pad').find('.number').each( function () {
            var currId = (this.id).replace("num-","");
            if(currId != "rem" && currId != "ok"){
                if(dispId == "num-std"){
                    this.innerHTML = currId.toString();
                }else{
                    this.innerHTML = cnDict[currId];
                }
            }
        });
    }
    
    initNumber();
    
    // When sound button clicked, say number
    $('#sound-button').click( function(){
        sayNumber();
    });
    
    // When any button on the number pad is clicked
    $('.number').click( function () {
        var _this = $(this)[0];
        var buttonId = _this.id;
        buttonId = buttonId.replace("num-", "");
        var input = $('#guess-input');
        
        // "X" button clicked, backspace
        if(buttonId == "rem"){
            input.val(input.val().slice(0,-1));
        
        // Checkmark clicked, submit guess
        } else if (buttonId == "ok"){
            if(!lockEnter){
                lockEnter = true;
                checkGuess(input);
            }
            
        // Add number to guess
        } else {
            input.val(input.val() + buttonId);
        }
    });
    
    // Change number of digits
    $('.digit').click( function() {
        var _this = $(this)
        $('.digit').removeClass('active');
        _this.addClass('active');
        var digId = (_this.context.id).replace("dig-", "");
        numDigits = parseInt(digId);
        initNumber();
    });
    
    // Toggle character display
    $('.options-numDisplay').click( function () {
        $('.options-numDisplay').removeClass('active');
        $(this).addClass('active');
        toggleNumDisplay($(this).context.id);
    });
    
});