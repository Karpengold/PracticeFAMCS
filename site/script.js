userName = "";
number = -1;
function loginUser() {
	userName = document.getElementById('login').value;
	document.getElementById('login').value = "";
	document.getElementById('password').value="";
}

function addElement() {

	var message = document.getElementById('inputsend');
	var now = new Date();

	var table = document.getElementById('messagebox');

	var tr = document.createElement('tr');

	var tdTime = document.createElement('td');
	tdTime.innerHTML = now.getHours() +":"+now.getMinutes() + " ";
	
	var tdName = document.createElement('td');
	tdName.innerHTML = userName + ": ";

	var tdMessage = document.createElement('td');

	tdMessage.innerHTML = " " + message.value;
	tdMessage.className = 'comment_bubble';

	tr.appendChild(tdTime);
	tr.appendChild(tdName);
	tr.appendChild(tdMessage);

	var tools = document.getElementById('visible');
	tr.onclick = function(event){
		if(tools.style.display=="none"){
			number = this.rowIndex;
			tools.style.display = "inline-block";
			
		}
		else {
			number = -1;
			tools.style.display = "none";
			
		}
	}
	table.appendChild(tr);
	document.getElementById('inputsend').value = "";
	return tr;
}


function deleteElement() { 
	var table = document.getElementById('messagebox');
	table.deleteRow(number);
	var tools = document.getElementById('visible');
	tools.style.display="none";
}

function editElement() {
	var tr = document.getElementById('messagebox').rows[number];
	tr.cells[2].innerHTML = "hi";

}


function history() {
	
	var tr = document.getElementById('messagebox').rows[0];
	var newTr = document.createElement('tr');
	var tdTime = document.createElement('td');
	tdTime.innerHTML = "Часы:Минуты";

	var tdName = document.createElement('td');
	tdName.innerHTML = "Юзверь: ";

	var tdMessage = document.createElement('td');

	tdMessage.innerHTML = "Здесь циклом выведется история с сервера";
	tdMessage.className = 'comment_bubble';

	newTr.appendChild(tdTime);
	newTr.appendChild(tdName);
	newTr.appendChild(tdMessage);
	

	document.getElementById('messagebox').insertBefore(newTr, tr);
}