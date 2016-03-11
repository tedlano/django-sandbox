var player;
var videoId;
var csrftoken = getCookie('csrftoken');

function getCodeFromUrl(url){
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    
    return video_id;
}

function onPlayerReady(){
    // Populate Attributes from video
    var videoData = player.getVideoData();
    $('#source-title').val(videoData.title);
    $('#source-author').val(videoData.author);
    
    //Clear "No Video Loaded" message
     $('#player').html("");
}

function onPlayerError(){
    $('#source-input').closest('.form-group').addClass("has-error");
}

// Trigger when Youtube Iframe is ready
function initPlayer(vidId) {
    player = new YT.Player('player', {
        videoId: vidId,
        iv_load_policy: 3,
        modestbranding: 1,
        
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
        }
    });
}

function getAllData(){
    var media = "YouTube";
    var refId = videoId;
    var title = $('#source-title').val();
    var author = $('#source-author').val();
    var capLabel = $('#captions-label').val();
    var tableRows = $('#captions-tbody').children();
    var startTime = $('#source-start').val();
    var order = 1;
    var skipped = 1;
    var captionArr = [];
    
    // Get all captions and push to object
    for(var i=0; i<tableRows.length; i++){
        var cells = tableRows[i].children;
        var caption = {};
        
        // If cell has no children, it is a blank cell
        if(!cells[0].firstChild){
            captionArr[i-skipped].break_after = true;
            skipped++;
            continue;
        }
        
        var captionText = cells[0].firstChild.value;
        
        caption.order = order;
        caption.text = captionText;
        caption.time = parseFloat(cells[1].firstChild.value);
        caption.break_after = false;
        
        captionArr.push(caption);
        order++;
    }
    
    return {
        'mediaType': media,
        'refId': refId,
        'title': title,
        'author': author,
        'start': startTime,
        'capLabel': capLabel,
        'captions': JSON.stringify(captionArr),
        'csrfmiddlewaretoken': csrftoken
    };
}

// Scroll table when marking caption times
function scroll(ele){
    var container = $('.table-container');
    console.log("eleOffsetTop: ", ele.offset().top, " , conOffsetTop: ", container.offset().top, " , conScrollTop: ", container.scrollTop());
    container.animate({
        scrollTop: ele.offset().top - container.offset().top + container.scrollTop() - 94
    });
}

$( window ).load( function() {
    
    // Get Youtube API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // After "Load Source" button is clicked, load YouTube video
    $('#source-load').click(function () {
        var src = $('#source-input').val();
        videoId = getCodeFromUrl(src);
        
        initPlayer(videoId);
    });
    
    // After "Load Captions" button is clicked, separate by line and create table
    $('#captions-load').click(function () {
        var text = $('#captions-textarea').val();
        var captionArr = text.split('\n');
        
        var table = $('#captions-table');
        $("#captions-tbody").empty();
        $('.table-container').removeClass("hide");
        
        for(var i=0; i<captionArr.length; i++){
            var cap = captionArr[i];
            var newRow = document.createElement('tr');
            
            var td1 = document.createElement('td');
            td1.className = "col-sm-9"
            var td2 = document.createElement('td');
            td2.className = "col-sm-2 col-mark"
            var td3 = document.createElement('td');
            td3.className = "col-sm-1"
            
            if(cap != ""){
                var td1_input = document.createElement('input');
                td1_input.type = "text";
                td1_input.className = "table-input";
                td1_input.value = captionArr[i];
                td1.appendChild(td1_input);
                
                var td2_input = document.createElement('input');
                td2_input.type = "number";
                td2_input.min = "0";
                td2_input.step = "0.1";
                td2.appendChild(td2_input);
                
                var td3_button = document.createElement('button');
                td3_button.type = "button";
                td3_button.className = "btn btn-primary btn-sm timestamp-button";
                td3_button.textContent = "Set";
                td3_button.addEventListener('click', function(){
                    var _this = $(this);
                    var trow = _this.closest('tr');
                    var timestamp = trow.find('td')[1].firstChild;
                    timestamp.value= Math.floor(player.getCurrentTime() * 10) / 10;
                    _this.addClass("btn-success");
                    scroll(_this);
                });
                td3.appendChild(td3_button);
            }else{
                newRow.className = "grey";
            }
            
            newRow.appendChild(td1);
            newRow.appendChild(td2);
            newRow.appendChild(td3);
            
            table.append(newRow);
        }
    });
    
    // Log start and end times when buttons are clicked
    $('#start-stop-marks button').click(function () {
        $(this).closest('.input-group').find('input')
            .val(Math.floor(player.getCurrentTime() * 10) / 10);
    });
    
    // Submit captions to DB
    $('#captions-submit').click(function () {
        
        // Setup AJAX so that csrf token is sent when invoked
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        
        var data = getAllData();
        console.log(data);
        
        $.ajax({
            url : "/caption_maker/submit_captions/",
            type : "POST",
            data : data,

            // handle a successful response
            success : function(json) {
                console.log("success"); // another sanity check
            },
    
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                
            }
        });
        
    });
 
});