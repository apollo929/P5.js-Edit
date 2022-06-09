// this constructor function allows us erase (draw with white color)
// todo: DRY this out. copy of Freehand tool
function TextEditorTool() {
    this.icon = "assets/text-editor.png";
    this.name = "text-editor";

  //   this.draw = function() {
  //   	if(mouseIsPressed) {
		// 	let inputElem = createElement("textarea");
		// 	inputElem.position(mouseX, mouseY);
		// 	inputElem.elt.onkeypress = function() {
		// 		inputItemClick();
		// 	}
  //   	}
  //   }

  //   function inputItemClick() {
  //   	console.log(this.value());
  //   	// removeElements();
		// // inputElem.position(mouseX, mouseY);
  //   }

	var previousMouseX = -1;
	var previousMouseY = -1;

	this.draw = function(){
		//if the mouse is pressed
		if(mouseIsPressed){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
				let inputElem = createDiv("<textarea />")
				inputElem.position(mouseX, mouseY);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		//try and comment out these lines and see what happens!
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};



}





