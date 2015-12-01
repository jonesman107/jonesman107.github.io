(function() {

	"use strict";

	var textLen;
	var id;
	var client;
	window.onload = function() {
		var deleteButton = document.getElementById("delete");
		deleteButton.onclick = deleteChoice;

		var yesButton = document.getElementById("yes");
		yesButton.onclick = deleteFile;

		var noButton = document.getElementById("no");
		noButton.onclick = notDelete;

		var fontSelect = document.getElementById("families");
		fontSelect.onchange = changeFont;

		var colorSelect = document.getElementById("colors");
		colorSelect.onchange = changeColor;

		var sizeSelect = document.getElementById("fonts");
		sizeSelect.onchange = changeSize;

		var boldButton = document.getElementById("bold");
		boldButton.checked = false;
		boldButton.onclick = bold;

		var italicButton = document.getElementById("italic");
		italicButton.checked = false;
		italicButton.onclick = italic;

		var textArea = document.getElementById("doc");
		textArea.onkeyup = change;

		var renameButton = document.getElementById("rename");
		renameButton.onclick = rename;

		var confirmButton = document.getElementById("confirm");
		confirmButton.onclick = confirm;

		var backButton = document.getElementById("back");
		backButton.onclick = back;

		document.getElementById("doc").value = "";
		id = window.location.href.split("id=")[1];
		connect();

		fillInFamily("font.txt")
		fillInColor("color.txt");
		fillInSize()
		textLen = document.getElementById("doc").value.length;

	}
	// connect to the server and get the document information of the current docID
	function connect() {
		if ("WebSocket" in window) {
			client = new WebSocket("ws://localhost:5555");
			client.onopen = function(event) {};
			client.onmessage = function(data) {
				var receive = data.data.toString();
				document.getElementById("doc").value = receive;
			};
		}

	}

	// display the delete choices and hide the textarea
	function deleteChoice() {
		document.getElementById("file").style.display = "none";
		document.getElementById("choice").style.display = "block";
	}

	// delete the file and return to the start page
	// todo: send change to server
	function deleteFile() {
		// sent to the server.
		location.href = "index.html";
	}

	// do not delete and show the text area again
	function notDelete() {
		document.getElementById("file").style.display = "initial";
		document.getElementById("choice").style.display = "none";
	}

	// fill in the font families options, default is Arial
	function fillInFamily(file) {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                var elements= allText.split(", ");
	                var list = document.getElementById("families");
					
					for (var i = 0; i < elements.length; i++) {
						var option = document.createElement("option");
						option.innerHTML = elements[i].split(" ")[0];
						if(elements[i].split(" ")[0] == "Arial") {
							option.selected = "selected";
						}
						list.appendChild(option);
					}
	            }
	        }
	    }
		rawFile.send();
	}

	// fill in the color options, default is black
	function fillInColor(file) {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                var elements= allText.split("\n");
	                var list = document.getElementById("colors");
					
					for (var i = 0; i < elements.length; i++) {
						var option = document.createElement("option");
						option.innerHTML = elements[i].split(" ")[0];
						if(elements[i].split(" ")[0] == "Black") {
							option.selected = "selected";
						}
						list.appendChild(option);
					}
	            }
	        }
	    }
		rawFile.send();
	}

	// fill in the size options: from 1pt to 50pt, default is 12pt
	// todo: send change to server
	function fillInSize() {
		var list = document.getElementById("fonts");
		for (var i = 1; i < 51; i++) {
			var option = document.createElement("option");
			option.innerHTML = i + "pt";
			if (i == 12) {
				option.selected = "selected";
			}
			list.appendChild(option);
		}
	}

	// change the font family in the text area
	// todo: send change to server
	function changeFont() {
		var font  = this.value;
		var text = document.getElementById("doc");
		text.style.fontFamily = font;
	}

	// change the font color in the text area
	// todo: send change to server
	function changeColor() {
		var color = this.value;
		var text = document.getElementById("doc");
		text.style.color = color;
	}

	// change the font size in the text area
	// todo: send change to server
	function changeSize() {
		var size = parseInt(this.value);
		var text = document.getElementById("doc");
		text.style.fontSize = size + "pt";
	}

	// bold the text
	// todo: send change to server
	function bold() {
		var text = document.getElementById("doc");
		if(this.checked) {
			text.style.fontWeight = "bold";
		} else {
			text.style.fontWeight = "normal";
		}
	}

	function italic() {
		var text = document.getElementById("doc");
		if(this.checked) {
			text.style.fontStyle = "italic";
		} else {
			text.style.fontStyle = "normal";
		}
		
	}

	// track the change in the textarea
	// todo: send change to server
	function change() {
		 var input = document.getElementById ("doc");
		 if(input.value.length > textLen) {
		 	// this is an add.
		 	var add = input.value.substring(input.selectionStart - (input.value.length - textLen), input.selectionStart);
			client.send(add);
		 	//alert("add " + add);
		 } else if(input.value.length < textLen) {
		 	//alert("delete " + (textLen - input.value.length));
		 } else{
		 	// this is a change of caret
		 	//alert(input.selectionStart)
		 }
		 textLen = input.value.length;            
	}

	// user asks for a raname
	function rename() {
		document.getElementById("fileName").style.display = "initial";
		document.getElementById("confirm").style.display = "initial";
		document.getElementById("back").style.display = "initial";
		document.getElementById("fileName").value = "";
	}

	// confirm the rename
	// todo: send change to server
	function confirm() {
		var newName = document.getElementById("fileName").value;
		if(!newName) {
			alert("Invalid name, please try again.");
			document.getElementById("fileName").innerHTML = "";
		} else {
			document.getElementById("fileName").style.display = "none";
			document.getElementById("confirm").style.display = "none";
			document.getElementById("name").innerHTML = newName;
		}
	}

	// giveup change the name
	function back () {
		document.getElementById("fileName").style.display = "none";
		document.getElementById("confirm").style.display = "none";
		document.getElementById("back").style.display = "none";
	}
} ());
