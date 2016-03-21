var player;
var interval;
var tIndex = 0;

function getCaptionLabel(label){
    switch (label){
        case "Chinese":
            return "中文";
        default:
            return label;
    }
}

// Find which caption is active
function findActiveCaption(){
    var t = player.getCurrentTime();

    if (t > timeArr[tIndex]){
        var ele = $(".line-" + ++tIndex);
        highlightLines(ele, "caption-cell");
        scroll(ele);
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
        findActiveCaption();
        interval = setInterval(findActiveCaption, 100);
        
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








