$( document ).ready(function() {
    
    var stopwatch_sec = $('#stopwatch_sec').val(0);
    var stopwatch_min = $('#stopwatch_min').val(0);
    var stopwatch_hr  = $('#stopwatch_hr').val(0);
    var interval;
    
    function getStopwatchData(){
        var activity_pk = $('#activity-id-hidden').val();
        var comment = $('#comment-textarea').val();
        var duration = stopwatch_hr.val() * 60 + stopwatch_min.val() + 1;
        
        return {
            activity_pk: activity_pk,
            comment: comment,
            duration: duration
        }
    }
    
    $('#play_pause').click(function () {
    
        var _this = $(this);
        var glyph = _this.find('.glyphicon');
        
        function getStopwatchTime(){
            var timeCount = ( ( parseInt(stopwatch_hr.val()) * 3600) + 
                                parseInt(stopwatch_min.val() * 60) + 
                                parseInt(stopwatch_sec.val()));
            var hours = Math.floor(timeCount / 3600);
            var minutes = Math.floor( (timeCount/60) % 60);
            var seconds = timeCount % 60;
            
            return {
			    'time': timeCount,
			    'hours': hours,
			    'minutes': minutes,
			    'seconds': seconds
            }
        }
        
        function updateStopwatch(){
            var t = getStopwatchTime();
            
            stopwatch_hr.val(t.hours);
            stopwatch_min.val(t.minutes);
            stopwatch_sec.val(t.seconds + 1);
            
            // Play a tone at 30 minute intervals
            if((t.minutes % 30 == 0 && t.seconds == 0 )
                || (t.hours > 0 && t.minutes == 0 && t.seconds == 0)){
                $('#alarm')[0].play();
            }
        }
        
        var play = glyph.hasClass('glyphicon-play');
        
        if (play){
            console.log("Play Timer", new Date());
            _this.removeClass('btn-default');
            glyph.removeClass('glyphicon-play');
            _this.addClass('btn-success');
            glyph.addClass('glyphicon-pause');
            _this.html(glyph);
            _this.append(" Pause");
            _this.val("pause");
            interval = setInterval(updateStopwatch, 1000);
            
        } else {
            console.log("Pause Timer", new Date());
            glyph.removeClass('glyphicon-pause');
            _this.removeClass('btn-success');
            glyph.addClass('glyphicon-play');
            _this.addClass('btn-default');
            _this.html(glyph);
            _this.append(" Resume");
            _this.val("play");
            clearInterval(interval);
        }
        
        var context = getStopwatchData();
        context.play_pause = play;
        
        $.ajax({
            url : "/activity_log/play_pause_click/",
            type : "POST",
            data : context, 

            // handle a successful response
            success : function(json) {
                console.log("success"); // another sanity check
            },
    
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                
            }
        });
        
        // $.get('/activity_log/play_pause_click/', context, function(data){
        // });

    });
    
    //  $('#addLog-submit').click(function () {
         
    //  });
});