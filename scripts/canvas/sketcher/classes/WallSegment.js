function WallSegment(context, x, y, size, imageIndex, bShouldLoad){
	this.context = context;
	this.x = x;
	this.y = y;
	this.size = size;
	this.imageIndex = imageIndex;
	this.image = null;
	this._isLoaded = false;
	this._needsSave = false;
	this.imageURL = 'http://localhost:8888/zeta/test_images/test_image_' + zeroPad(this.imageIndex, 4) + '.png';
	if(bShouldLoad){
		this.loadImage();
	}
}

WallSegment.prototype.update = function(previousMouseX, mouseX){
	this.x += mouseX - previousMouseX;
}

WallSegment.prototype.display = function(){
	if(this.isLoaded()){
		this.context.drawImage(this.image, this.x, this.y, this.size, this.size);
	}
}

WallSegment.prototype.updateImage = function(){
	console.log(this.image);
	var self = this;

	//create two memory-only canvas
	var tempCanvas = this._createCanvas();
	var tempContext = tempCanvas.getContext('2d');
	var tempCanvas2 = this._createCanvas();
	var tempContext2 = tempCanvas2.getContext('2d');

	tempContext.drawImage(this.image, 0, 0); //draw the old image to the first mem-only canvas

	//get the new image with all changes since the last drag (taken from the visible canvas)
	var newImageData = this.context.getImageData(this.x, this.y, this.size, this.size);
	tempContext2.putImageData(newImageData, 0, 0); //place the new image in the second mem-only canvas
	var newImageURL = tempCanvas2.toDataURL('image/png');
	var newImage = new Image();
	newImage.src = newImageURL;
	newImage.onload = function(){
		
		//draw the new image on top of the old image in the 
		//first mem-only canvas
		tempContext.drawImage(newImage, 0, 0);
		var dataURL = tempCanvas.toDataURL('image/png');

		//save the compilation as the new image
		var combinedImage = new Image();
		combinedImage.src = dataURL;
		combinedImage.onload = function(){
			self.image = combinedImage;
			// console.log(self.image.src)
		}
	}
}

WallSegment.prototype.loadImage = function(){
	var self = this;
	this.image = new Image();
	this.image.src = this.imageURL;
	this.image.height = this.size;
	this.image.width = this.size;
	this.image.onload = function() {
    	self._isLoaded = true;
	}		  
}

WallSegment.prototype.isLoaded = function(){
	return this._isLoaded;
}

WallSegment.prototype.needsSave = function(){
	return this._needsSave;
}

WallSegment.prototype.inside = function(mouseX){
	if(mouseX > this.x &&
	   mouseX < this.x+this.size) return true;
	else return false;
}

//------------------------------------------------------------------------
//PROTECTED FUNCTIONS

WallSegment.prototype._createCanvas = function(){
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = this.size;
	tempCanvas.height = this.size;
	return tempCanvas;
}

