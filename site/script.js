userName = "";
var editedRowsCount = 0;
var messageList = [];

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};
function loginUser() {
	userName = document.getElementById('login').value;
	if(userName == "") return;
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
	if(message.value =="" || userName == "") return;
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
		

	/*	if(number != -1) {
				document.getElementById('messagebox').rows[number].cells[2].style.background = "#337ab7" ;
				
		}

		
		alert(this.classList);
		if(tools.style.display=="none"){

			tools.style.display = "inline-block";
			tdMessage.style.background = "#2F4F4F";
			number = this.rowIndex;
		}
		else {
			
			
		} */
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
	var tools = document.getElementById('visible');
	tools.style.display = "none";
	userName = localStorage.getItem("Username");
	var allMessages = restore();

	createAllMessages(allMessages);
}
function createAllMessages(allMessages) {
	 for(var i = 0; i < allMessages.length; i++)
	 	addElement(allMessages[i]);
}
function deleteElement() { 
	/*var table = document.getElementById('messagebox');
	table.deleteRow(number);
	var tools = document.getElementById('visible');
	tools.style.display="none";*/
	
	var tr = document.getElementsByClassName('edited');
	var table = document.getElementById('messagebox');
	var size = tr.length;
	var allMessages = restore();
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
	var tr = document.getElementsByClassName('edited');
	var edit = document.getElementById('inputsend').value;
	tr[0].cells[2].innerHTML = edit;
	var allMessages = restore();

	 for(var i = 0; i < allMessages.length; i++)
	 	if(tr[0].cells[3].innerHTML == allMessages[i].messageId){
	 		allMessages[i].description = edit;
	 		store(allMessages);
	 		return;
	 	}

	document.getElementById('buttonedit').style.display = "none";
	document.getElementById('buttonsend').style.display = "inline-block";	
	document.getElementById('inputsend').value = "";
}