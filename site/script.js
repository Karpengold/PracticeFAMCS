userName = "";
var editedRowsCount = 0;
var messageList = [];


var Application = {
	mainUrl : 'http://localhost:9081/chat',
	messageList:[],
	token : 'TN11EN'
};

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};
function loginUser() {
	userName = document.getElementById('login').value;
	if(userName.length > 15){
		userName = "";
		document.getElementById('login').value = "";
		alert("Try smaler name");
		return;
	}
	
	if(userName == ""){
		alert("Please, input your name");
		return;
	} 
	localStorage.setItem("Username", userName);
	document.getElementById('login').value = "";
	
}
var theMessage = function(time, message, userName, edited) {
	return {
		text:message,
		timestamp:time,
		author: userName,
		messageId: uniqueId(),
		edit: edited
	}; 
};


function newMessage() {
	var message = document.getElementById('inputsend');
	if(message.value =="" || userName == "") return;
	var now = new Date();
	var msg = theMessage(now.getTime(), message.value, userName, "false");
	//
	addMessage(msg, function() {
		//addElement(msg);
	});

	
	
}
function addMessage(msg,done){
	

	ajax('POST', Application.mainUrl, JSON.stringify(msg), function(){
		Application.messageList.push(msg);
		done();
	});
}

function addElement(theMessage) {
	
	
	//messageList.push(theMessage);
	var table = document.getElementById('messagebox');

	var tr = document.createElement('tr');

	var time = new Date(theMessage.timestamp);
	var tdTime = document.createElement('td');
	tdTime.innerHTML = time.getHours() + ":" + time.getMinutes() + " ";
	
	var tdName = document.createElement('td');
	tdName.innerHTML = theMessage.author+ ": ";

	var tdMessage = document.createElement('td');

	tdMessage.innerHTML = " " + theMessage.text;
	tdMessage.className = 'comment_bubble';

	var tdId = document.createElement('td');

	tdId.innerHTML = theMessage.messageId;
	tdId.className = 'idBlock';
	if(theMessage.edit == "true")
		tdId.className = 'editBlock';
	

	tr.appendChild(tdTime);
	tr.appendChild(tdName);
	tr.appendChild(tdMessage);
	tr.appendChild(tdId);
	
	
	var tools = document.getElementById('visible');
	tr.onclick = function(event){
		if(this.classList.contains("edited")){
			editedRowsCount--;			
			this.classList.remove("edited");
			tdMessage.style.background = "#337ab7";
		}
		else {
			editedRowsCount++;
			this.classList.add("edited");	
			tdMessage.style.background = "#2F4F4F";		
		}

		if(editedRowsCount > 0){
			tools.style.display = "inline-block";
			
		}
		else {
			tools.style.display = "none";
		}

		if(editedRowsCount > 1){
			document.getElementById('editbutton').style.display = "none";
		}
		else {
			document.getElementById('editbutton').style.display = "inline-block";
		}
	
	}
	table.appendChild(tr);
	document.getElementById('inputsend').value = "";
	store(messageList);
}
function restore() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	var item = localStorage.getItem("messageList");

	return item && JSON.parse(item);
}
function store(listToSave) {

	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
	localStorage.setItem("messageList", JSON.stringify(listToSave));
	
}
function run(){
	/*var tools = document.getElementById('visible');
	tools.style.display = "none";
	userName = localStorage.getItem("Username");
	var allMessages = restore();
	createAllMessages(allMessages);*/

	loadTasks(function(){
		createAllMessages(Application.messageList);

	});
}
function loadTasks(done) {
	var url = Application.mainUrl + '?token=' + Application.token;

	ajax('GET', url, null, function(responseText){
		var response = JSON.parse(responseText);

		Application.messageList = response.messages;
		Application.token = response.token;
		done();
		loadTasks(function(){
		createAllMessages(Application.messageList);
	});
	});

}
function createAllMessages(allMessages) {
	 for(var i = 0; i < allMessages.length; i++)
	 	addElement(allMessages[i]);
}
function indexById(list, id){
  for(var i = 0; i< list.length; i++) {
    if(list[i].id == id) {
      return i;
    }
  }
  return -1;
}
function deleteElement() { 
	
	
	editedRowsCount --;
	var tools = document.getElementById('visible');
	tools.style.display = "none";
	var tr = document.getElementsByClassName('edited');
	var table = document.getElementById('messagebox');
	var size = tr.length;
	var allMessages = restore();

	

	for(var i=0; i<size; i++){
		var id = tr[i].cells[3].innerHTML;
		var url = Application.mainUrl + '?msgId=' + id;
		var index = indexById(Application.messageList, id);
		
		ajax('DELETE', url, null, function(){
		Application.messageList.splice(index, 1);
		
	});	
	}
	


    for(var i = 0; i < allMessages.length; i++) {
 		for(var j=0; j<size; j++){
	 		if(tr[j].cells[3].innerHTML == allMessages[i].messageId){
		 		allMessages.splice(i,1);		
		 	}
 		}
 	}
 	store(allMessages);
	for(var i = size - 1; i >= 0; i--){
		table.deleteRow(tr[i].rowIndex);
	}
	
	
}	




function editElement() {	
	document.getElementById('buttonedit').style.display = "inline-block";
	document.getElementById('buttonsend').style.display = "none";	
}
function editMessage() {
	var tr = document.getElementsByClassName('edited');
	if(!tr[0].cells[3].classList.contains('editBlock')){
		tr[0].cells[3].classList.add('editBlock');
	}


	var edited = document.getElementById('inputsend').value;

	var id = tr[0].cells[3].innerHTML;

	tr[0].cells[2].innerHTML = edited;
	tr[0].cells[2].style.background = "#337ab7";
	
	var allMessages = restore();
	var editedMessage = {
	 			messageId:id,
	 			text:edited	 			
				};
	ajax('PUT', Application.mainUrl, JSON.stringify(editedMessage), function(){
	 			 document.getElementById('visible').style.display = "none";
				document.getElementById('buttonedit').style.display = "none";
				document.getElementById('buttonsend').style.display = "inline-block";	
				edited.value = "";Messages[i].edit = "true";
	 		}
	 		);
	 		store(allMessages);

	

	
	

}


function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();

	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4)
			return;

		if(xhr.status != 200) {
			continueWithError('Error on the server side, response ' + xhr.status);
			return;
		}

		if(isError(xhr.responseText)) {
			continueWithError('Error on the server side, response ' + xhr.responseText);
			return;
		}

		continueWith(xhr.responseText);
	};    

    xhr.ontimeout = function () {
    	ontinueWithError('Server timed out !');
    };

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"\n'+
    	'- server sends header "Access-Control-Allow-Methods: PUT, DELETE, POST, GET, OPTIONS"\n';

        continueWithError(errMsg);
    };

    xhr.send(data);
}

function defaultErrorHandler(message) {
	console.error(message);
	output(message);
}

function isError(text) {
	if(text == "")
		return false;
	
	try {
		var obj = JSON.parse(text);
	} catch(ex) {
		return true;
	}

	return !!obj.error;
}

