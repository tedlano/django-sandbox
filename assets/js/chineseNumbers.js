$( window ).load( function() {
    
    var audPath = '/static/media/audio/$.mp3';
    var num, status;
    var correct = 0;
    var wrong = 0;
    var streak = 0;
    var audioSrc;
    var numDigits = 3;
    var lockEnter = false;
    var cnDict = {
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
    
    // Try to improve this with:
    // http://stackoverflow.com/questions/7330023/gapless-looping-audio-html5
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
            status = (guess == num ? "correct" : "wrong");
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
                    status = "guess";
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
        console.log(dispId);
        $('#number-entry-pad').find('.number').each( function () {
            var currId = (this.id).replace("num-","");
            if (currId != "rem" && currId != "ok"){
                if(dispId == "num-std"){
                    this.innerHTML = currId.toString();
                } else {
                    this.innerHTML = cnDict[currId];
                }
            }
        });
    }
    
    initNumber();
    
    $('#sound-button').click( function(){
        sayNumber();
    });
    
    // If "Enter" key is pressed in guess-input
    $('#guess-input').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            if(!lockEnter){
                lockEnter = true;
        		checkGuess($(this));
            }
        }
    });
    
    $('.number').click( function () {
        var _this = $(this)[0];
        var buttonId = _this.id;
        buttonId = buttonId.replace("num-", "");
        var input = $('#guess-input');
        
        if(buttonId == "rem"){
            input.val(input.val().slice(0,-1));
            
        } else if (buttonId == "ok"){
            if(!lockEnter){
                lockEnter = true;
                checkGuess(input);
            }
        } else {
            input.val(input.val() + buttonId);
        }
    });
    
    $('.digit').click( function() {
        var _this = $(this)
        $('.digit').removeClass('active');
        _this.addClass('active');
        var digId = (_this.context.id).replace("dig-", "");
        numDigits = parseInt(digId);
        initNumber();
    });
    
    $('.options-numDisplay').click( function () {
        $('.options-numDisplay').removeClass('active');
        $(this).addClass('active');
        toggleNumDisplay($(this).context.id);
    });
    
});