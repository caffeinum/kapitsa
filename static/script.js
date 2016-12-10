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
    
    var user_id = $(".feedback").data("user-id")
    
    $(".feedback .btn").click(function () {
        var status = $(this).data("value")

        $.get("/feedback", {id: user_id, status: status})
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

function check_range(num, a, b){
    if ( typeof num != "number" ) return false;
    return num >= a && num <= b
}

function validateEGE(num) {
    return check_range(num, 20, 100)
}


function validate( dict ) {
    // REMOVE THIS WHEN PRODUCTION
    // return 0

    if ( ! check_range(dict["friends"], 0, 100000))
        return 2
    if ( ! dict["department"] )
        return 2

    if ( ! validateEGE( dict["exam_points_maths"] ) )
        return 1
    if ( ! validateEGE( dict["exam_points_phys"] ) )
        return 1
    if ( ! validateEGE( dict["exam_points_russ"] ) )
        return 1

    if ( ! check_range(dict["final_year"], 1940, 2030))
        return 3

    return 0
}

function submit( dict ) {
    var v = validate(dict); 
    if ( v > 0 ) {
        $(".error").removeClass("hide")  
        if (v == 1){
            $(".error").text("Баллы ЕГЭ должны лежать на отрезке [20, 100]")
        }
        if (v == 2){
            $(".error").text("Не все поля заполнены или некоторые заполнены неправильно!")
        }
        if (v == 3){
            $(".error").text("Год выпуска должен быть в формате YYYY")
        }

        return;
    } else {
        $(".error").addClass("hide")
    }
    
    console.log(dict)
    console.log( JSON.stringify(dict) )
    
    dict["exam_points"] =
        dict["exam_points_maths"] + 
        dict["exam_points_phys"] + 
        dict["exam_points_russ"] 
    
    $('form').submit()
    return
    
    var url = '/form-submit'
    
    
    var posting = jQuery.post(url, {json:JSON.stringify(dict)}) 
    
    posting.done(function( data ) {
        console.log( data );
    	
        var image_url = data["url"]
        var id = data["id"]
        var score = data["score"]
        window.location = "/final?id="+id+"&score="+score;
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



