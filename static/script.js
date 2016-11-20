    var leshe_json = {};

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
    var posting = jQuery.post(url, JSON.stringify(dict));  
    
    posting.done(function( data ) {
        var content = jQuery( data );
        console.log(content);
    });
    
    return JSON.stringify(dict)
}


