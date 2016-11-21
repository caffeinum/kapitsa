var leshe_json = {
	department: "ФОПФ",
	relatives: "Да",
	"social activity": "Да",
	"increased scholarships": "Да",
	"exam retakes": "Не было ни одной",
	"influenced by": "Семья",
	"religion": "Да",
	"nutrition": "Чаще готовил сам",
	"lectures": "Почти всегда",
	"sport": "Да",
	"friends": 0,
	"exam_points": 0
};
var image_url = "";

jQuery(function () {
	$('#image').removeClass('hide');

	if ( image = getImageUrl() ) {
    		$('#image').attr('src', image)
    		$('#share_buttons').attr('data-image', "http://kapitsa-vs-you.ru" + image)

	}
})

function selectAnswer1(element) {
    console.log(element.value)
    leshe_json["department"] = element.value
}

function selectAnswer2(element) {
    console.log(element.value)
    leshe_json["relatives"] = element.value
}

function selectAnswer3(element) {
    console.log(element.value)
    leshe_json["social activity"] = element.value
}

function selectAnswer4(element) {
    console.log(element.value)
    leshe_json["increased scholarships"] = element.value
}

function selectAnswer5(element) {
    console.log(element.value)
    leshe_json["exam retakes"] = element.value
}

function selectAnswer6(element) {
    console.log(element.value)
    leshe_json["influenced by"] = element.value
}

function selectAnswer7(element) {
    console.log(element.value)
    leshe_json["religion"] = element.value
}

function selectAnswer8(element) {
    console.log(element.value)
    leshe_json["nutrition"] = element.value
}

function selectAnswer9(element) {
    console.log(element.value)
    leshe_json["lectures"] = element.value
}

function selectAnswer10(element) {
    console.log(element.value)
    leshe_json["sport"] = element.value
}

function selectAnswer11(element) {
    console.log(element.value)
    leshe_json["friends"] = element.value
}

function selectAnswer12(element) {
    console.log(element.value)
    leshe_json["exam_points"] = element.value
}

function sendResult() {
    submit( leshe_json )
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

    /* 
    var images = [
        "/img/results/ft.png",
        "/img/results/fe.png",
        "/img/results/st.png",
        "/img/results/et.png"
    ]
    
    
    var json = JSON.stringify(dict)
    var image_url = images[ json.length % 4 ]
    */
    
    
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



