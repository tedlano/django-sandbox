$( document ).ready(function() {
    
    var audPath = '/static/media/audio/$.mp3';
    var num, status, audio;
    var correct = 0;
    var wrong = 0;
    var streak = 0;
    var audioSrc;
    
    // Try to improve this with:
    // http://stackoverflow.com/questions/7330023/gapless-looping-audio-html5
    function sayNumber(){
        var idx = 0;
        audio.src = audioSrc[idx++];
        audio.play();

        audio.onended = function () {
            if(idx < audioSrc.length){
                audio.src = audioSrc[idx++];
                audio.play();
            }
        }
    }
    
    function initAudio() {
        num = Math.floor(Math.random() * 1000);
        console.log(num);
        var digits = (""+num).split("");
        var len = digits.length;
        status = "guess";
        audioSrc = [];
        
        audio = $('audio#num-audio')[0];
        audio.defaultPlaybackRate = 1.2;
        
        //If 10-19, don't pronounce the leading "1"
        if(!(digits[0] == "1" && len ==2)) {
        
            //If 200-something, 2 pronounced "liang"
            if(digits[0] == "2" && len ==3){
                audioSrc.push(audPath.replace('$', '2l'));
            } else {
                audioSrc.push(audPath.replace('$', digits[0]));
            }
        }
        
        //If tens-place digit is 0, don't pronounce "shi"
        var ten = digits[len-2] == "0";
        var hundred = false;
        
        for(var i=1; i<len; i++){
            if(!hundred && len > 2){
                audioSrc.push(audPath.replace('$', '100'));
                hundred = true;
                
                if(num % 100 == 0) break;
                i--;
                continue;
            }
            
            if(!ten && len > 1 && (len - i == 1)){
                audioSrc.push(audPath.replace('$', '10'));
                ten = true;
                i--;
                continue;
            }
            
            if( !(i == len -1 && digits[len-1] == "0")){
                audioSrc.push(audPath.replace('$', digits[i]));
            }
        }

        sayNumber();
    }
    
    function checkGuess(ele){
        var guess = ele.val();
        
        // If blank entry, highlight in yellow
		if(guess == null || guess == ""){
		    ele.removeClass("correct wrong").addClass("warning");
		    
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
                    initAudio();
                 }, 1000);
            
            // If guess is wrong   
            } else {
                wrong++;
                streak = 0;
                $('#results-text')[0].innerHTML = "Correct: " + correct + 
                                                  ", Wrong: " + wrong + 
                                                  ", Streak: " + streak;
                sayNumber();
            }
		}
    }
    
    initAudio();
    
    $('#sound-button').click( function(){
        sayNumber();
        $('#guess-input')[0].focus();
    });
    
    // If "Enter" key is pressed in guess-input
    $('#guess-input').keypress(function(event){
    	var keycode = (event.keyCode ? event.keyCode : event.which);
    	if(keycode == '13'){
    		checkGuess($(this));
    	}
    });
    
    // $('#guess-button').click( function (){
    //     var guess = $('#guess-input').val();
    //     status = (guess == num ? "correct" : "wrong");
    //     $('#guess-input').removeClass("correct wrong").addClass(status);
    // });
    
    $('.number').click( function () {
        var _this = $(this)[0];
        var buttonId = _this.id;
        buttonId = buttonId.replace("num-", "");
        var input = $('#guess-input');
        
        if(buttonId == "rem"){
            input.val(input.val().slice(0,-1));
            
        } else if (buttonId == "ok"){
            checkGuess(input);
        } else {
            input.val(input.val() + buttonId);
        }
    });
});