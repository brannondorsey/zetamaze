function WallDrawing(canvas, numbImages){

	//pick a random wallIndex to start on
	//this.currentImageIndex = Math.ceil(Math.random()*numbImages-1);
	this.currentImageIndex = 3;
	this.wallSize = 512;
	this.wallSegments = [];
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');

	var startX = this.canvas.width/2 - this.currentImageIndex * this.wallSize;
	var x = startX;

	for(var i = 0; i < numbImages; i++){
		var shouldLoad;
		if(i < 10){
			shouldLoad = true;
		}else shouldLoad = false;
		this.wallSegments[i] = new WallSegment(this.context, x, 0, this.wallSize, i + 1, shouldLoad);
		x += this.wallSize;
	}
}

WallDrawing.prototype.saveImages = function(){
	this.updateImages();
}

WallDrawing.prototype.updateImages = function(){

	//borrowing method from:
	//http://stackoverflow.com/questions/3309571/getdataurl-for-part-of-the-canvas-object
	var index = this._getCurrentWallIndex();
	// if(index == 0) index = 1;
	// if(index == this.wallSegments.length - 1) index = this.wallSegments.length - 2;
	console.log('the image number ' +  (index + 1) + ' is closest to the center');
	var centerWallSegment = this.wallSegments[index];
	var leftWallSegment = this.wallSegments[index - 1];
	var rightWallSegment = this.wallSegments[index + 1];

	var centerImageData = this.context.getImageData(centerWallSegment.x, 
												    centerWallSegment.y, 
												    centerWallSegment.size, 
												    centerWallSegment.size);

	var leftImageData = this.context.getImageData(leftWallSegment.x, 
												  leftWallSegment.y, 
												  leftWallSegment.size, 
												  leftWallSegment.size);

	var rightImageData = this.context.getImageData(rightWallSegment.x, 
												   rightWallSegment.y, 
												   rightWallSegment.size, 
												   rightWallSegment.size);

	//make a new temporary canvas to draw imageData object from the
	//three wallSegments to and then save from
	var tempCanvas = document.createElement('canvas');
	var tempContext = tempCanvas.getContext('2d');
	tempCanvas.width = centerWallSegment.size;
	tempCanvas.height = centerWallSegment.size;

	centerWallSegment.updateImage(tempCanvas, centerImageData);
	leftWallSegment.updateImage(tempCanvas, leftImageData);
	rightWallSegment.updateImage(tempCanvas, rightImageData);
}

//called onMouseUp if dragging tool was enabled. 
WallDrawing.prototype.loadNewImages = function(startX, endX){

	//images dragged right, load left
	if(startX < endX){

	}else{ //images dragged left, load right

	}
}

WallDrawing.prototype.drag = function(previousMouseX, mouseX){
	this._walkWallSegments(function(wallSegment){
		wallSegment.update(previousMouseX, mouseX);
	});
}

WallDrawing.prototype.display = function(){
	this._walkWallSegments(function(wallSegment){
		wallSegment.display();
	});
}

//------------------------------------------------------------------------
//PROTECTED FUNCTIONS

//returns the index of wall currently most in the frame of the canvas
WallDrawing.prototype._getCurrentWallIndex = function(){
		
	var closestWallSegment = this.wallSegments[0];
	this._walkWallSegments(function(wallSegment){
		
		var frameCenterX = this.canvas.width/2;

		var closestWallSegmentCenterX = closestWallSegment.x + closestWallSegment.size/2;
		var currentClosestDist = Math.abs(frameCenterX - closestWallSegmentCenterX);

		var wallSegmentCenterX = wallSegment.x + wallSegment.size/2;
		var dist = Math.abs(frameCenterX - wallSegmentCenterX);

		if(wallSegment.imageIndex == 3){
			console.log('The distance between 3 and center is ' + dist);
		}else if(wallSegment.imageIndex == 4){
			console.log('The distance between 4 and center is ' + dist);
		}
		//if this wallSegment is closer to the center of the frame of the
		//canvas replace closestWallSegment
		if(dist < currentClosestDist) closestWallSegment = wallSegment;
	});
	return closestWallSegment.imageIndex - 1;
}

WallDrawing.prototype._walkWallSegments = function(fn){
	for(var i = 0; i < this.wallSegments.length; i++){
		var needsBreak = fn(this.wallSegments[i]);
		if(needsBreak) break;
	}
}