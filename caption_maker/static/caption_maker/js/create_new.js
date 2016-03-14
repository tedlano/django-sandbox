var player;
var videoId;
var csrftoken = getCookie('csrftoken');
var captionLineArr = {};

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
    var description = $('#source-description').val();
    var capLabel = $('#captions-label').val();
    var startTime = $('#source-start').val();
    var order = 1;
    var skipped = 1;
    var labelArr = [];
    var captionArr = [];
    
    // Get all caption labels
    $('.captions-label').each(function (i) {
        var label = $(this).val();
        labelArr.push(label);
    })
    
    // Loop through all caption table rows and create caption objects
    $('#captions-tbody').children().each(function (i) {
        var cells = this.children;
        var caption = {};
        
        if(!cells[0].firstChild){
            captionArr[i-skipped].break_after = true;
            skipped++;
            return;
        }
        
        //var captionText = cells[0].firstChild.value;
        caption.order = order;
        //caption.text = captionText;
        caption.time = parseFloat(cells[1].firstChild.value);
        caption.break_after = false;
        
        captionArr.push(caption);
        order++;
    });
    
    return {
        'mediaType': media,
        'refId': refId,
        'title': title,
        'author': author,
        'description': description,
        'start': startTime,
        'capLabel': capLabel,
        'captions': JSON.stringify(captionArr),
        'captionLines': JSON.stringify(captionLineArr),
        'labels': labelArr,
        'csrfmiddlewaretoken': csrftoken
    };
}

// Scroll table when marking caption times
function scroll(ele){
    var container = $('.table-container');
    // console.log("eleOffsetTop: ", ele.offset().top, 
    //             " , conOffsetTop: ", container.offset().top, 
    //             " , conScrollTop: ", container.scrollTop());
    container.animate({
        scrollTop: ele.offset().top - container.offset().top + container.scrollTop() - 94
    });
}

$( window ).load( function() {
    
    // Get Youtube API script
    var $tag = $("<script>", {src: "https://www.youtube.com/iframe_api"});
    $("script:first").before($tag);
    
    // When "Load Source" button is clicked, load YouTube video
    $('#source-load').click(function () {
        var src = $('#source-input').val();
        videoId = getCodeFromUrl(src);
        initPlayer(videoId);
    });
    
    // When "Add Secondary Captions" button is clicked, add another captions block
    $('#captions-add').click(function () {
        var html = $("#captions-template").html();
        var $clone = $(html);
        
        $clone.find('#captions-remove').click( function (){
            this.closest(".captions-block").remove();
        });
    
        $('.captions-block:last').after($clone);
    });
    
    // // When "Remove Secondary Captions" button is clicked, remove div
    // $('#captions-remove').click(function () {
    //     this.closest("captions-block").remove();
    // })
    
    // When "Load Captions" button is clicked, separate captions by line and create table
    $('#captions-load').click(function () {
        captionLineArr = {};
        var primaryCaps;
        var $table = $('#captions-table');
        
        $("#captions-tbody").empty();
        $('.table-container').removeClass("hide");
        
        $('.captions-block').each(function(i) {
            var label = $(this).find(".captions-label:first").val();
            var captions = $(this).find(".captions-textarea:first").val();
            var capArr = captions.split('\n');
            if(i==0) primaryCaps = capArr;
            
            captionLineArr[label] = capArr.filter(Boolean);
            
        });
    
        for(var i=0; i<primaryCaps.length; i++){

            var cap = primaryCaps[i].trim();
            var $newRow = $("<tr>"); 
            
            // Create table data elements
            var $td1 = $("<td>", {class: "col-sm-9"});
            var $td2 = $("<td>", {class: "col-sm-2 col-mark"});
            var $td3 = $("<td>", {class: "col-sm-1"});
            
            // If the captions is not a blank line, add text and button elements to row
            if(cap != ""){
                $("<input>", {type: "text", class: "table-input", value: cap}).appendTo($td1);
                $("<input>", {type: "number", min: "0", step: "0.1"}).appendTo($td2);
                $("<button>", {    type: "button", 
                                 class:"btn btn-primary btn-sm timestamp-button", 
                                 text: "Set",
                                 click: function(){
                                     var $this = $(this);
                                     var $trow = $this.closest('tr');
                                     var $timestamp =$trow.find('td')[1].firstChild;
                                     $timestamp.value= Math.floor(player.getCurrentTime() * 10) / 10;
                                     $this.addClass("btn-success");
                                     scroll($this);
                                 }
                            }).appendTo($td3);
            }else{
                $newRow.addClass("grey");
            }
            
            //Append elements to new row, and new row to caption table
            $newRow.append($td1)
                   .append($td2)
                   .append($td3)
                   .appendTo($table);

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
        // console.log(data);
        
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