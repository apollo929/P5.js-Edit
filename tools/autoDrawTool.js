// this constructor function allows the user to draw something 
// freehand and then it suggests and replaces the user's drawing
// with stencils. The drawing ends when user stops drawing.
// todo: allow multiple shapes
// stencils: json file containing categories and related svg image urls
// stencils file is located in data/stencils.json
function AutoDrawTool(stencils) {
    this.icon = "assets/autodraw.png";
    this.name = "autoDrawTool";

    // maximum number of icons to display
    const maxIcons = 20;
    // manages mouse state
    // pressedAt is the time the drawing started
    let previousMouseX, previousMouseY, pressedAt;
    // list containing user drawing
    // format: [[x coods], [y coods], [time when cood was added]]
    let currentShape = [];

    // div with suggestion images are added
    let suggestionDiv;
    // bbox containing the user shape (used to draw the suggested shape)
    let shapeBBox;

    // todo: copied code from freehand tool. Dry this
	this.draw = function(){
        //if the mouse is pressed inside the canvas
        const mouseIsPressedInCanvas = mouseIsPressed && 
            mouseX > 0 && mouseX < width && 
            mouseY > 0 && mouseY < height;
		if(mouseIsPressedInCanvas){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
                previousMouseY = mouseY;
                pressedAt = Date.now();
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else {
                currentShape[0].push(previousMouseX);
                currentShape[1].push(previousMouseY);
                currentShape[2].push(Date.now() - pressedAt);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		else if (previousMouseX != -1) {
            // when user releases the mouse give user the suggestions
            shapeBBox = getBBoxFromShape(currentShape);
            sendRequest(currentShape, processApiData);
			resetShape();
        }
    };

    this.unselectTool = function() {
        select(".options").html("");
    }

    this.populateOptions = function() {
        suggestionDiv = createDiv();
        suggestionDiv.parent(select(".options"));
        suggestionDiv.id('suggestions');
    }
    
    let resetShape = function() {
        previousMouseX = -1;
        previousMouseY = -1;
        pressedAt = -1;

        currentShape = [
            [], // x coods
            [], // y coods
            []  // times
        ];
    }

    // sends a request to the API with shape
    // resultCallback: called when post request is complete
    let sendRequest = function(shapes, resultCallback) {
        // todo: error handling for failed calls
        const url = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
        const options = {
            "input_type" : 0,
            "requests" : [
                {
                    "language" : "autodraw",
                    "writing_guide" : {"width" : width, "height" : height},
                    "ink" : [shapes]
                }
            ]
        };
        httpPost(
            url,
            'json',
            options,   
            resultCallback
        );
    }

    // processes the API by parsing the list of suggestions
    // displays the suggestions in suggestions div
    let processApiData = function(response) {
        try {
            data = JSON.parse(response[1][0][3].debug_info.match(/SCORESINKS: (.*) Service_Recognize:/)[1]).map(
                result => {
                    return {
                        name: result[0],
                        icons: (stencils[result[0]] || []).map(x => x.src)
                    }
                }
            );
            setSuggestions(data);
        } catch (err) {
            // on error resets suggetions
            resetSuggestions();
            console.log(err);
        }
    }

    // takes a list of suggestions with icons and draws them on the DOM
    let setSuggestions = function(suggestions) {
        resetSuggestions();
        let iconCount = 0;
        // iterate over suggestion
        for(let i=0; i < suggestions.length; i++) {
            // iterate over all icons in suggestion
            for(let j=0; j < suggestions[i].icons.length; j++) {
                // create an image element with callback
                const iconUrl = suggestions[i].icons[j];
                const imgElement = createImg(iconUrl, suggestions[i].name);
                imgElement.size(50, 50);
                imgElement.class('suggested-img');
                imgElement.parent(suggestionDiv);
                imgElement.mouseClicked(suggestionClicked);
                iconCount++;
                if(iconCount > maxIcons) return;
            }
        }
    }

    // clears the DOM suggestion div
    let resetSuggestions = function() {
        suggestionDiv.html('');
    }

    // event handler for suggestions
    // when a suggestion is clicked, it replaces the original
    // drawing with svg of clicked suggestion
    // todo: SVGs render as images and are blurry. draw them as p5 shapes
    let suggestionClicked = function(clickEvent) {
        const imageElement = clickEvent.srcElement;
        console.log(imageElement);
        updatePixels(); // get rid of the image
        // get image from URL
        loadImage(imageElement.src, img => {
            image(img, shapeBBox.x, shapeBBox.y, shapeBBox.w, shapeBBox.h);
            loadPixels();
        });
        
        resetSuggestions();
        resetShape();
    }

    // fits a bounding box around the user's drawing
    let getBBoxFromShape = function(shape) {
        x_min = Math.min(...shape[0]);
        x_max = Math.max(...shape[0]);
        y_min = Math.min(...shape[1]);
        y_max = Math.max(...shape[1]);
        return {
            x: x_min,
            y: y_min,
            w: x_max - x_min,
            h: y_max - y_min
        };
    }

    resetShape();
}
