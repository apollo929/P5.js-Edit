// allows the user to fill in enclosed shapes with a color
// colorPalette: reference to the colour palette object. 
// todo: decouple this. More research required.
function BucketTool(colorPalette) {
    this.icon = "assets/paintBucket.png";
    this.name = "bucketTool";
    
    this.draw = function() {
        // checks if mouse is pressed inside canvas
        // todo: move to helpers since this is used in multiple extensions
        const mouseIsPressedInCanvas = mouseIsPressed && 
            mouseX > 0 && mouseX < width && 
            mouseY > 0 && mouseY < height;
        if (mouseIsPressedInCanvas) {
            // populate the pixels array
            loadPixels();
            // get color from color palette
            let colour = colorPalette.selectedColourAsRgb();
            // apply floodFill on pixels array
            floodFill(mouseX, mouseY, colour);
            // render new pixels array
            updatePixels();
        }
    };

    // applies the flood fill algorithm on pixels array
    // requires loadPixels() to be called before this.
    // x, y: flood fill starts here
    // targetColour: List[3] with RGB target color
    let floodFill = function(x, y, targetColour) {
        const stack = [];
        const intialColour = getPixelColor(x, y);
        let current = {x, y};

        if(compareColors(intialColour, targetColour)) {
            return
        }

        // add clicked location to stack
        stack.push({x: current.x, y: current.y});

        // while stack is not empty process each element from stack
        while(stack.length > 0) {
            // get the element from the top of the stack
            current = stack.pop();

            // variables used to control direction of fill
            let moveDown = true;
            let moveUp = true;
            let moveLeft = false;
            let moveRight = false;

            // move to the top most pixel with same color
            while(moveUp && current.y >= 0) {
                current.y--;
                // sets moveup to false when we hit a different color or get to y = 0
                moveUp = compareColors(getPixelColor(current.x, current.y), intialColour);
            }

            // move down until we hit a color change or hit end of canvas
            // and change all pixels to targetColor
            // also add left/right to stack as we go down
            while(moveDown && current.y < height) {
                setPixelColor(targetColour, current.x, current.y);

                // check left and add to stack
                if (current.x - 1 >= 0 && 
                    compareColors(getPixelColor(current.x - 1, current.y), intialColour)) {
                    if(!moveLeft) {
                        moveLeft = true;
                        stack.push({x: current.x - 1, y: current.y});
                    }
                } else {
                    moveLeft = false;
                }

                // check right and add to right
                if (current.x + 1 < width && 
                    compareColors(getPixelColor(current.x + 1, current.y), intialColour)) {
                    if(!moveRight) {
                        moveRight = true;
                        stack.push({x: current.x + 1, y: current.y});
                    }
                } else {
                    moveRight = false;
                }

                current.y += 1;
                moveDown = compareColors(getPixelColor(current.x, current.y), intialColour);
            }
        }
    }

    // gets colour of pixel at x,y
    // returns array[3] with rgb values
    let getPixelColor = function(x, y) {
        // we only look at the value of one of the subpixels if
        // pixel density > 1
        const d = pixelDensity();
        const index = 4 * ((y * d) * width * d + (x * d));
        return [
            pixels[index],
            pixels[index + 1],
            pixels[index + 2]
        ]
    }

    // sets the colour of pixel at x,y with color value
    let setPixelColor = function(color, x, y) {
        // some screens (Macs with retina) has a higher pixel density
        // so we need to loop over each subpixel for each pixel and set
        // all of them
        const d = pixelDensity();
        for (var i = 0; i < d; i++) {
            for (var j = 0; j < d; j++) {
                const index = 4 * ((y * d + j) * width * d + (x * d + i));
                pixels[index] = color[0];
                pixels[index+1] = color[1];
                pixels[index+2] = color[2];
            }
        }
    }

    // compares two colors
    // x, y are arrays of size 3 (rbg)
    let compareColors = function(x, y) {
        return x[0] == y[0] && x[1] == y[1] && x[2] == y[2];
    }
}