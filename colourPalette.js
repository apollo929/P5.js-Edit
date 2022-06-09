//Displays and handles the colour palette.
function ColourPalette() {
	//a list of web colour strings
	this.colours = ["black", "silver", "gray", "white", "maroon", "red", "purple",
		"orange", "pink", "fuchsia", "green", "lime", "olive", "yellow", "navy",
		"blue", "teal", "aqua"
	];
	//make the start colour be black
	this.selectedColour = "black";

	var self = this;

	var colourClick = function() {
		//remove the old border
		var current = select("#" + self.selectedColour + "Swatch");
		current.style("border", "0");

		//get the new colour from the id of the clicked element
		var c = this.id().split("Swatch")[0];

		//set the selected colour and fill and stroke
		self.selectedColour = c;
		fill(c);
		stroke(c);

		//add a new border to the selected colour
		this.style("border", "2px solid blue");
	}

	this.selectedColourAsRgb = function() {
		const colourMapping = {
			"black": [0, 0, 0],
			"silver": [192, 192, 192], 
			"gray": [128, 128, 128], 
			"white": [255, 255, 255], 
			"maroon": [128, 0, 0], 
			"red": [255, 0, 0], 
			"purple": [128, 0, 128],
			"orange": [255, 165, 0], 
			"pink": [255, 192, 203], 
			"fuchsia": [255, 0, 255],
			"green": [0, 128, 0],
			"lime": [0, 255, 0], 
			"olive": [128, 128, 0], 
			"yellow": [255, 255, 0],
			"navy": [0, 0, 128],
			"blue": [0, 0, 255], 
			"teal": [0, 128, 128],
			"aqua": [0, 255, 255]
		}
		return colourMapping[this.selectedColour] || [0, 0, 0];
	}

	//load in the colours
	this.loadColours = function() {
		//set the fill and stroke properties to be black at the start of the programme
		//running
		fill(this.colours[0]);
		stroke(this.colours[0]);

		//for each colour create a new div in the html for the colourSwatches
		for (var i = 0; i < this.colours.length; i++) {
			var colourID = this.colours[i] + "Swatch";

			//using JQuery add the swatch to the palette and set its background colour
			//to be the colour value.
			var colourSwatch = createDiv()
			colourSwatch.class('colourSwatches');
			colourSwatch.id(colourID);

			select(".colourPalette").child(colourSwatch);
			select("#" + colourID).style("background-color", this.colours[i]);
			colourSwatch.mouseClicked(colourClick)
		}

		select(".colourSwatches").style("border", "2px solid blue");
	};
	//call the loadColours function now it is declared
	this.loadColours();
}