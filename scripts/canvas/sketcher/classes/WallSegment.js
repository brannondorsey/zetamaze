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

WallSegment.prototype.updateImage = function(canvas, newImageData){

	var self = this;

	var context = canvas.getContext('2d');
	context.putImageData(newImageData, 0, 0);
	var dataURL = canvas.toDataURL('image/png');

	var newImage = new Image();
	newImage.src = dataURL;
	newImage.onload = function(){
		self.image = newImage;
		console.log(self.image)
	}
}

WallSegment.prototype.loadImage = function(){
	var self = this;
	this.image = new Image();
	this.image.src = this.imageURL;
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

