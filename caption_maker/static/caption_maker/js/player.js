// Find closest array index, return lower
function findArrIndex(t, arr){
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    
    if(t < arr[0]) return -1;
    
    while (hi - lo > 1) {
        mid = Math.floor ((lo + hi) / 2);
        if (arr[mid] < t) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return lo;
}

// Highlight active captions, remove highlights from inactive ones
function highlightLines(ele = null, remClass, highlight = true){
    $('.' + remClass).removeClass('highlight');
    if(ele && highlight) ele.addClass('highlight');
}

// Scroll table when marking caption times
function scroll(ele, offset = 0){
    var container = $('.lyrics-container');
    // console.log("eleOffsetTop: ", ele.offset().top, 
    //             " , containerOffsetTop: ", container.offset().top, 
    //             " , containerScrollTop: ", container.scrollTop());
    container.animate({
        scrollTop: ele.offset().top - container.offset().top + container.scrollTop() - offset
    });
}

// Load YouTube API Script
function loadYouTubeAPIScript(){
    var $tag = $("<script>", {  src: "https://www.youtube.com/iframe_api" });
    $("script:first").before($tag);
}