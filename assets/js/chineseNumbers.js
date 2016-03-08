$( window ).load( function() {
    
    var num;                        // Random number to guesss
    var correct = 0;                // Number of correct guesses
    var wrong = 0;                  // Number of wrong guesses
    var streak = 0;                 // Number of correct guesses in a row
    var numDigits = 3;              // Default number of digits
    var lockEnter = false;          // Prevent double-click submit
    var lang = "Chinese Female";    // Default Language
    var mobile = false;
    var cnDict = {                  // Dictionary to change numbers 
        "0": "零",                      // into Chinese Characters
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
        responsiveVoice.speak(num.toString(), lang);
    }
    
    function initNumber() {
        num = Math.floor(Math.random() * Math.pow(10,9));
        num=parseInt(num.toString().slice(0, numDigits));
        console.log(num);

        sayNumber();
        $("#guess-input")[0].focus();
    }
    
    $('#guess-input').keypress(function(event){
    	var keycode = (event.keyCode ? event.keyCode : event.which);
    	if(keycode == '13'){
    		checkGuess($(this));
     	}
    });
    
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
    
    window.mobilecheck = function() {
        mobile = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))mobile = true})(navigator.userAgent||navigator.vendor||window.opera);
        $('#guess-input').attr('readonly', mobile);
    }
    
    if(navigator.userAgent.match(/Android/i)){
        window.scrollTo(0,1);
    }
    
    initNumber();
    
    // window.addEventListener("load",function() {
    // 	// Set a timeout...
    // 	setTimeout(function(){
    // 		// Hide the address bar!
    // 		window.scrollTo(0, 1);
    // 	}, 0);
    // });
    
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
    
    $('#lang-select').on('change', function() {
        lang = $(this).val().replace("-"," ");
    });
    
});