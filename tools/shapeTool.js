// this constructor function allows us draw shapes on the canvas
// the user can select the shape from a dropbox
function ShapeTool() {
    this.icon = "assets/shapes.png";
    this.name = "shapeTool";

    // private variables --------
    // available shapes
    let shapes = ["Rectangle", "Triangle", "Circle"];
    // current shape. changes via the dropbox DOM event handler
    let selectedShape = shapes[0];
    // stores the bbox of based on user iteractions
    // type: {x: 0, y: 0, w: 0, h: 0}
    let state = null;
    
    this.draw = function() {
        if(mouseIsPressed) {
            // 1. starts drawing the shape
            if (state.x == -1 && state.y == -1) {
                state.x = mouseX;
                state.y = mouseY;
            } else {
                // 2. dragging the mouse
                state.w = mouseX - state.x;
                state.h = mouseY - state.y;
                // reset the canvas and draw the new shape
                updatePixels();
                if (selectedShape == "Rectangle") {
                    rect(state.x, state.y, state.w, state.h);
                } else if (selectedShape == "Triangle") {
                    // equiateral triangle around the initial point
                    // x1, y1 = state.x, state.y - state.h
                    // y2, y3 = state.h + state.y
                    // x2 = state.x - state.w
                    // x3 = state.x + state.w
                    triangle(state.x, state.y - state.h, 
                        state.x - state.w, state.y + state.h, 
                        state.x + state.w, state.y + state.h);
                } else if (selectedShape == "Circle") {
                    // circle around x, y with radius = max(width, height)
                    ellipse(state.x, state.y, Math.max(state.w, state.h) * 2.0);
                }
            }
        } else {
            // 3. let go mouse so stop drawing
            if (state.x != -1) {
                resetState();
                // save the copy of image in memory permenantly
                loadPixels();
            }
        }
    }

    // used to reset the options html when tool is unselected
    this.unselectTool = function() {
        select(".options").html("");
    }

    // generates the DOM dropdown box with shape options
    this.populateOptions = function() {
        let shapeSelect = createSelect();
        for(let i=0; i<shapes.length; i++) {
            shapeSelect.option(shapes[i]);
        }
        shapeSelect.parent(select(".options"));
        shapeSelect.changed(()=> {
            selectedShape = shapeSelect.value();
        });
    }

    let resetState = function() {
        state = {
            x: -1, 
            y: -1,
            w: -1,
            h: -1
        }
    }
    resetState();
}