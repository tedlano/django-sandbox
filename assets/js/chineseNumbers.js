$( window ).load( function() {
    
    var audPath = '/static/media/audio/$.mp3';
    var num, status, audio;
    var correct = 0;
    var wrong = 0;
    var streak = 0;
    var audioSrc;
    var numDigits = 3;
    var lockEnter = false;
    var voice = "cnf";
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
        if(voice == "ted"){
            var idx = 0;
            audio.src = audioSrc[idx++];
            audio.play();
    
            audio.addEventListener('timeupdate', function(){
                var buffer = .2;
                if(this.currentTime > this.duration - buffer && idx < audioSrc.length){
                    this.currentTime = 0
                    audio.src = audioSrc[idx++];
                    this.play();
                }}, false);
    
            // audio.onended = function () {
            //     if(idx < audioSrc.length){
            //         audio.src = audioSrc[idx++];
            //         audio.play();
            //     }
            // }
        } else {
            responsiveVoice.speak(num.toString(), "Chinese Female");
        }
    }
    
    function initNumber() {
        num = Math.floor(Math.random() * Math.pow(10,9));
        num=parseInt(num.toString().slice(0, numDigits));
        console.log(num);
        
        if(voice == "ted"){
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
        } else {
            
        }

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
            if(!lockEnter){
                lockEnter = true;
                checkGuess(input);
            }
        } else {
            input.val(input.val() + buttonId);
        }
    });
    
    $('.options-voice').change( function () {
        if ($(this).context.id == 'voice-ted'){
            voice = "ted";
            initNumber();
        } else {
            voice = "cnf";
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