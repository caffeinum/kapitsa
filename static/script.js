leshe_json = {
        "department": "ФОПФ",
        "relatives": "Да",
        "social_activity": "Да",
        "increased_scholarships": "Да",
        "exam_retakes": "Не больше трёх",
        "influenced_by": "Семья",
        "religion": "Да",
        "nutrition": "Чаще готовил сам",
        "lectures": "Почти всегда",
        "sport": "Да",
        "friends": 0,
        "exam_points": 0
};
var image_url = "";

var json = leshe_json

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

    collectAnswers()
})


function collectAnswers() {
    var dict = {}

    $("input[type=radio]").each(function (index, answer){
        if ( $(this).prop('checked') )
            dict[ $(this).attr('name') ] = $(this).val()
    })

    $("input[type=text]").each(function (index, answer){
        dict[ $(this).attr('name') ] = $(this).val()
    })

    $("select").each(function (index, answer){
        dict[ $(this).attr('name') ] = $(this).val()
    })


    console.log(dict)

    json = dict
    return dict
}

function sendResult() {
    submit( json )
}

function submit( dict ) {
    console.log(dict)
    console.log( JSON.stringify(dict) )
    
    var url = '/form-submit'
    var posting = jQuery.post(url, {json:JSON.stringify(dict)});  
    
    posting.done(function( data ) {
        console.log( data );
    	
        var image_url = data	
        window.location = "/final.html?image="+image_url;
    });
    
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



