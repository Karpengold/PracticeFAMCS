userName = "";
number = -1;
var messageList = [];

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};
function loginUser() {
	userName = document.getElementById('login').value;
	localStorage.setItem("Username", userName);
	document.getElementById('login').value = "";
	
}
var theMessage = function(time, message, userName) {
	return {
		description:message,
		timelot:time,
		user: userName,
		messageId: uniqueId()
	}; 
};


function newMessage() {
	var message = document.getElementById('inputsend');
	if(message.value =="") return;
	var now = new Date();
	addElement(theMessage(now.getHours()+":"+now.getMinutes(), message.value, userName));
	
}
function addElement(theMessage) {
	messageList.push(theMessage);
	var table = document.getElementById('messagebox');

	var tr = document.createElement('tr');

	var tdTime = document.createElement('td');
	tdTime.innerHTML = theMessage.timelot + " ";
	
	var tdName = document.createElement('td');
	tdName.innerHTML = theMessage.user + ": ";

	var tdMessage = document.createElement('td');

	tdMessage.innerHTML = " " + theMessage.description;
	tdMessage.className = 'comment_bubble';

	var tdId = document.createElement('td');
	tdId.innerHTML = theMessage.messageId;
	tdId.style.display = "none";

	tr.appendChild(tdTime);
	tr.appendChild(tdName);
	tr.appendChild(tdMessage);
	tr.appendChild(tdId);

	var tools = document.getElementById('visible');
	tr.onclick = function(event){
		if(number != -1) {
				document.getElementById('messagebox').rows[number].cells[2].style.background = "#337ab7" ;
				
		}
		if(tools.style.display=="none"){

			tools.style.display = "inline-block";
			tdMessage.style.background = "#2F4F4F";
			number = this.rowIndex;
		}
		else {
			
			tools.style.display = "none";
			tdMessage.style.background = "#337ab7";
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

	var item = localStorage.getItem("TODOs taskList");

	return item && JSON.parse(item);
}
function store(listToSave) {

	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	localStorage.setItem("TODOs taskList", JSON.stringify(listToSave));
}
function run(){
	var tools = document.getElementById('visible');
	tools.style.display = "none";
	userName = localStorage.getItem("Username");
	var allTasks = restore();

	createAllTasks(allTasks);
}
function createAllTasks(allTasks) {
	 for(var i = 0; i < allTasks.length; i++)
	 	addElement(allTasks[i]);
}
function deleteElement() { 
	var table = document.getElementById('messagebox');
	table.deleteRow(number);
	var tools = document.getElementById('visible');
	tools.style.display="none";
	var allTasks = restore();
	var tr = document.getElementById('messagebox').rows[number];
	 for(var i = 0; i < allTasks.length; i++)
	 	if(tr.cells[3].innerHTML == allTasks[i].messageId){
	 		allTasks.splice(i,1);
	 		store(allTasks);
	 		return;
	 	}
}



function history() {
	
	var tr = document.getElementById('messagebox').rows[0];
	var newTr = document.createElement('tr');
	var tdTime = document.createElement('td');
	var tools = document.getElementById('visible');
	newTr.onclick = function(event){
		if(tools.style.display=="none"){
			number = this.rowIndex;
			tools.style.display = "inline-block";
			
		}
		else {
			number = -1;
			tools.style.display = "none";			
		}
	}
	var tdName = document.createElement('td');
	
	var tdMessage = document.createElement('td');

	tdMessage.innerHTML = "Здесь циклом выведется история с сервера";
	tdMessage.className = 'comment_bubble';

	newTr.appendChild(tdTime);
	newTr.appendChild(tdName);
	newTr.appendChild(tdMessage);
	

	document.getElementById('messagebox').insertBefore(newTr, tr);
}
function editElement() {	
	document.getElementById('buttonedit').style.display = "inline-block";
	document.getElementById('buttonsend').style.display = "none";	
}
function editMessage() {
	var tr = document.getElementById('messagebox').rows[number];
	var edit = document.getElementById('inputsend').value;
	tr.cells[2].innerHTML = edit;
	var allTasks = restore();

	 for(var i = 0; i < allTasks.length; i++)
	 	if(tr.cells[3].innerHTML == allTasks[i].messageId){
	 		allTasks[i].description = edit;
	 		store(allTasks);
	 		return;
	 	}

	document.getElementById('buttonedit').style.display = "none";
	document.getElementById('buttonsend').style.display = "inline-block";	
	document.getElementById('inputsend').value = "";
}