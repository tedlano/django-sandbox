var player;

function getCodeFromUrl(url){
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    
    return video_id;
}

// Trigger when Youtube Iframe is ready
function initPlayer(vidId) {
    player = new YT.Player('player', {
        videoId: vidId,
        iv_load_policy: 3,
        modestbranding: 1
    });
}

$( window ).load( function() {
    
    
    // After "Load Source" button is clicked, load YouTube video
    $('#source-load').click(function () {
        var src = $('#source-input').val();
        var vidId = getCodeFromUrl(src);
        initPlayer(vidId);
    });
    
    // After "Load Captions" button is clicked, separate by line and create table
    $('#captions-load').click(function () {
        var text = $('#captions-textarea').val();
        var captionArr = text.split('\n');
        
        var table = $('#captions-table');
        $("#captions-tbody").empty();
        table.removeClass("hide");
        
        for(var i=0; i<captionArr.length; i++){
            var cap = captionArr[i];
            var newRow = document.createElement('tr');
            
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            
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
                td3_button.className = "btn btn-primary timestamp-button";
                td3_button.textContent = "Set";
                td3_button.addEventListener('click', function(){
                    var trow = $(this).closest('tr');
                    var timestamp = trow.find('td')[1].firstChild;
                    timestamp.value= Math.floor(player.getCurrentTime() * 10) / 10;
                    trow.addClass("success");
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
    
    // Get Youtube API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 
});