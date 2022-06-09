// this constructor function allows us erase (draw with white color)
// todo: DRY this out. copy of Freehand tool
function EraserTool() {
    this.icon = "assets/eraser.png";
    this.name = "eraserTool";

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
                // start new drawing state to keep stroke settings local
                push();
                stroke(255, 255, 255);
                strokeWeight(10);
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                pop(); // restroke original state
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		else{
			previousMouseX = -1;
			previousMouseY = -1;
        }
    };
}