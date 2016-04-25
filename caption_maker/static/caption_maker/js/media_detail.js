var player;
var interval;
var tIndex = 0;
var currentTime = 0;
var int_ms = 100;

function getCaptionLabel(label){
    switch (label){
        case "Chinese":
            return "中文";
        default:
            return label;
    }
}

// Find which caption is active
function findActiveCaption(useApiBool){
    if (tIndex == -1){
        var ele = $(".line-1:visible");
        highlightLines(ele, "caption-cell", false);
        scroll(ele, 80);
        tIndex++;
    }
    
    if (useApiBool){
        currentTime = player.getCurrentTime();
    } else {
        currentTime+= (int_ms / 1000);
    }
    
    if (currentTime > timeArr[tIndex]){
        var ele = $(".line-" + ++tIndex + ":visible");
        highlightLines(ele, "caption-cell");
        scroll(ele, 80);
        
        //To make sure play is caught up
        currentTime = player.getCurrentTime();
    }
}

// Trigger when Youtube Iframe is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: videoId,
        playerVars: { 'start': startTime, 
                      'end': endTime,
                      'iv_load_policy': 3,
                      'modestbranding': 1
        },
        
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// Trigger whenever player state changes (Playing, Paused, Buffering, etc)
function onPlayerStateChange(event) {
    // If player is playing, continually check active captions
    if (event.data == YT.PlayerState.PLAYING) {
        tIndex = findArrIndex(player.getCurrentTime(), timeArr);
        findActiveCaption(true);
        interval = setInterval(findActiveCaption, int_ms, false);
        
    // If player is not playing, stop checking for active captions
    } else {
        clearInterval(interval);
    }
}

$( window ).load( function() {
    
    // Get Youtube API script
    loadYouTubeAPIScript();
    
    // Add caption toggle buttons
    for(var i=0; i<labelList.length; i++){
        var label = labelList[i];
        $("<button>", { class: "btn btn-success btn-sm",
                        name: label,
                        text: getCaptionLabel(label),
                        click: function(){
                            if($(this).hasClass("btn-success")){
                                var thisClass = "." + $(this).attr('name').toLowerCase();
                                $(this).removeClass("btn-success").addClass("btn-primary");
                                $(thisClass).hide(); //a bit hacky
                                
                            }else{
                                var thisClass = "." + $(this).attr('name').toLowerCase();
                                $(this).removeClass("btn-primary").addClass("btn-success");
                                $(thisClass).show(); //a bit hacky
                            }
                        }
                }).appendTo($('#toggle-buttons'));
    }
    
});








