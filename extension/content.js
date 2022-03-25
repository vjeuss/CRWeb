console.log("Content Script Loaded from CRWEB Extension");
//Get all the JSON LD in the page
var all_json_ld = document.querySelectorAll('script[type="application/ld+json"]');
var all_crweb_script = [];
if (all_json_ld.length > 0) {
    console.log("JSON LD Data found");
    all_crweb_script = find_crweb_json_ld(all_json_ld);
    if (all_crweb_script.length > 0) {
        console.log("CR_WEB Data Found")
        ///sending to run time to the popup script
        send_to_runtime({ subject: "CRWEB_JSON", data: all_crweb_script });
        console.log(all_crweb_script);
        all_crweb_script.forEach((element)=> {downloadFile({ fileName: new Date(), data: element })});
    }
    else {
        console.log("!! No CR_WEb data !!");
    }

}


chrome.runtime.onMessage.addListener(
    function (incomingMessage, sender, sendResponse) {
        if (incomingMessage.subject == "getCurrentPageInfo") {
            console.log(incomingMessage);

        
            
        chrome.runtime.sendMessage({
				subject: 'pageInfoResponse',
				data: all_crweb_script
			});

        }
    });


// Returns array of all the scripts related to CRWEB
function find_crweb_json_ld(all_json_ld) {
   all_json_ld = Array.from(all_json_ld);
   let filtered_crweb_json= all_json_ld.filter(function (element, index, array) {
        var json_element = JSON.parse(element.innerText);
        return (json_element.$schema == "schema-crweb-2022feb28-jsonld");
   });
    let cr_web_list = filtered_crweb_json.map((element) => { return element.innerHTML });
    return cr_web_list;
}

//Sends Data to the Runtime with subject and data
function send_to_runtime({ subject, data,from="content" } = {}) {
    try {
    console.log("sending to runtime");
    chrome.runtime.sendMessage({subject,data,from});
	}
	catch (err) {
		console.debug('caught err', err)
	}
}

function downloadFile({ data, fileName } = {}) {
	var file = new Blob([data], { type: "application/json" });
	var a = document.createElement("a")
	var url = URL.createObjectURL(file);
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}