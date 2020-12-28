// input > arraybuffer > transfer > blob > output
// todo .chain
function Notes(pre, select){
	this.pre = document.getElementById(pre);
	this.select = document.getElementById(select);
	this.request = new XMLHttpRequest();
	this.reader = new FileReader();	
	this.request.addEventListener('load', this.requestLoad.bind(this, true), false);
	this.reader.addEventListener('load', this.readerLoad.bind(this, true), false);	
	this.select.addEventListener('change', this.change.bind(this, true), false);
	this.initialize.apply(this, arguments);
};

Notes.prototype = {
	initialize : function(url){
		this.request.responseType = 'arraybuffer';
		this.request.open('GET', url, true);
		this.request.send(null);
	},
	
	requestLoad : function(){
		this.pre.innerHTML = '';		
		this.reader.readAsBinaryString(this.request.response);		
	},
	
	readerLoad : function(){
		this.pre.innerHTML = this.reader.result;	
	},
	
	change : function(){},
};


const noteChoose = document.querySelector("select");
const noteDisplay = document.querySelector("pre");

noteChoose.onchange = function() {
	var note = noteChoose.value;
	updateDisplay(note);
};

function updateDisplay(note) {
	note = note.replace(" ", "");
	note = note.toLowerCase();

	const url = note + ".txt";

	const request = new XMLHttpRequest();

	request.open("GET", url, true);
	request.responseType = "text";
	
	request.onload = function() {
		
		const blob = new Blob([request.response], { 
			type:'application/octet-stream' 
		});
		
		const uuid = URL.createObjectURL(blob);
		
		const reader = new FileReader();
		
		reader.onload = function(event){
			noteDisplay.innerHTML = '';		
			noteDisplay.appendChild(document.createTextNode(request.response));
		}
		
		reader.readAsBinaryString(blob);
		
	};
	request.send(null);
}

updateDisplay("Networks");
noteChoose.value = "Networks";
