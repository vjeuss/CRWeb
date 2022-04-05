var CRWEB_JSON;

sendMessageToCurrentTab({subject:'getCurrentPageInfo'});

// Sends message to current tab 
function sendMessageToCurrentTab({ subject = "", data = "", from="popup" } = {}) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {subject,data,from});
	});
}

function sendMessageToRuntime({ subject="", data="", from="popup" }={}) {
	chrome.runtime.sendMessage({subject,data,from});
}

chrome.runtime.onMessage.addListener(
    function (incomingMessage, sender, sendResponse) {
        if (incomingMessage.subject == "CRWEB_JSON" || incomingMessage.subject == "pageInfoResponse") {
            CRWEB_JSON = incomingMessage.data;
            document.getElementById("status").innerHTML = (CRWEB_JSON.length > 0) ? "Page Information": "!! CRWEB DATA Not found !!";
            //VJ- tags
            jsonw = JSON.parse(incomingMessage.data);
            receiptId = jsonw.receiptId;
            dataController = jsonw.piiController;
            privacyNotice = jsonw.privacyNotice;
            thirdParties = "no";
            for (var service in jsonw.services) {
			    if ( jsonw.services[service].thirdPartyDisclosure != "" ) thirdParties = "yes";
			}
            
            //document.getElementById("cr_web").value = 
            document.getElementById("status").innerHTML = 
            	//"<br><b>receipt ID: </b>" + jsonw.receiptId +
            	"<br><b>Data Controller: </b>" + jsonw.piiController +
            	"<br><b>Privacy Notice: </b><a href='" + jsonw.privacyNotice + "'>here</a>" +
                "<br><b>Third-parties: </b>" + thirdParties +
                "<br><b>Storage Location: </b>" + jsonw.storageLocation +
                "<br><b>Status of Receipt: </b><span style='color:green;'>" + jsonw.statusOfReceipt + "</span>" +
                "<br><b>Rating: </b><span style='color:green;'>" + "<b>very good<b>&nbsp<sup><img src='external.png' style='width:10px;'></sup>" + "</span>" +
                //"<br><br><hr><b>raw JSON-LD:</b>" +
            	//incomingMessage.data.toString() +
                "<br><br><button class='button' type='button'>All Receipts</button>&nbsp<button class='button' type='button'>Act on Receipt</button>" +
                ""
            	;
        }
    });

