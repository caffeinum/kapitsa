var image_url = "";

var json = {}

jQuery(function () {
        $('#image').removeClass('hide');

        if ( image = getImageUrl() ) {
                $('#image').attr('src', image)
                $('#share_buttons').attr('data-image', "http://kapitsa-vs-you.ru" + image)
        }

    $("input select").change(function(event) {
        var id = $(this).attr("id")

        collectAnswers()
    })

    $("input").change(function(event) {
        var id = $(this).attr("id")

        collectAnswers()
    })

    $(".form-check").on("click", function() {
        $(this).find("input").select()
    })
    
    collectAnswers()
})


function collectAnswers() {
    var dict = {}

    $("input[type=radio]").each(function (index, answer){
        if ( $(this).prop('checked') )
            dict[ $(this).attr('name') ] = $(this).val()
    })

    $("input[type=text]").each(function (index, answer){
        if ( $(this).val() )
            dict[ $(this).attr('name') ] = $(this).val()
    })
    
    $("input[type=number]").each(function (index, answer){
        if ( $(this).val() )
            dict[ $(this).attr('name') ] = Number( $(this).val() )
    })

    $("select").each(function (index, answer){
        if ( $(this).val() )
            dict[ $(this).attr('name') ] = $(this).val()
    })


    console.log(dict)

    json = dict
    return dict
}

function sendResult(event) {
    collectAnswers()
    submit( json )
    //event.stopPropagation()
    //return false
}

function validate( dict ) {
    if ( typeof dict["exam_points"] != "number" )
        return false
    if ( typeof dict["friends"] != "number" )
        return false
    if ( !dict["department"] )
        return false
        
    return true
}

function submit( dict ) {
    if ( ! validate(dict) ) {
        $(".error").removeClass("hide")  
        return
    } else {
        $(".error").addClass("hide")
    }
    
    console.log(dict)
    console.log( JSON.stringify(dict) )
    
    var url = '/form-submit'
    var posting = jQuery.post(url, {json:JSON.stringify(dict)}) 
    
    posting.done(function( data ) {
        console.log( data );
    	
        var image_url = data["url"]
        window.location = "/final.html?image="+image_url;
    });
    
    posting.fail(function(error) {
        console.log("error", error)
        $(".error").removeClass("hide").text("Error sending")
    })
    
    return JSON.stringify(dict)
}

function getImageUrl() {
	var image_str = window.location.search.slice(1).split('&').filter(function(elem){ return elem.split("=")[0] == "image" })[0]
	if ( image_str ) {
		return image_str.split("=")[1];
	} else {
		return null
	}
}



