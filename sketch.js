//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
let stencils = null;


function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");

	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	stencils = helpers.loadStencils();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new AutoDrawTool(stencils));
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new BucketTool(colourP));
	toolbox.addTool(new ShapeTool());
	toolbox.addTool(new EraserTool());
	toolbox.addTool(new TextEditorTool());
	background(255);

}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
}

// let textContent = "";
// let j = 0;
// function mouseClicked() {
//   if(toolbox.selectedTool.name === "text-editor") {
//   	if(mouseButton === LEFT) {
//   		console.log('asdf');
//   		var inputElem = createElement("textarea");
//   		inputElem.position(mouseX, mouseY);
//   		let button = createButton('submit');
//   		button.position(inputElem.x - 55, inputElem.y);
//   		button.mouseClicked(inputItemClick);
// 		greeting = createElement('h2', 'what is your name?');
// 		greeting.position(40, 45);
//   	}

//   	var inputItemClick = function() {
//   		console.log('asdf');
// 		const name = inputElem.value();
// 		greeting.html('hello ' + name + '!');
// 		inputElem.value('');
//   	}
// 	  // clear();
// 	  // textSize(20);
// 	  // textContent += key;
// 	  // text(textContent, 100, 150);
// 	}
// }
          
