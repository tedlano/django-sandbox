var csrftoken = getCookie('csrftoken');

$( window ).load( function() {
    
    $('.favorite').click(function(){
        $(this).find('span').toggleClass('glyphicon-star-empty')
                            .toggleClass('glyphicon-star star-color');
                            
        var media_id = $(this).closest('tr').find('.id-col').html().trim();
    
        // Setup AJAX so that csrf token is sent when invoked
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    
        $.ajax({
            url : "/caption_maker/favorite_media/",
            type : "POST",
            data : {
                    'media_id': media_id, 
                    'user_id': user_id
            },
    
            success : function(json) {
                
            },
    
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                console.log(errmsg);
            }
        });
    });
    
});