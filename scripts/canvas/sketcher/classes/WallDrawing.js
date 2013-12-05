function WallDrawing(canvas, numbImages){

	//pick a random wallIndex to start on
	this.currentImageIndex = Math.ceil(Math.random()*numbImages-1);
	//this.currentImageIndex = 3;
	this.wallSize = 512;
	this.wallSegments = [];
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	this.numbInitImagesToLoad = 10; //must be odd number
	this._initImagesLoaded = false;
	this.initWallSegments = [];

	var startX = this.canvas.width/2 - this.currentImageIndex * this.wallSize;
	var x = startX;

	for(var i = 0; i < numbImages; i++){
		var shouldLoad;
		if(i > this.currentImageIndex - this.numbInitImagesToLoad/2 &&
		   i < this.currentImageIndex + this.numbInitImagesToLoad/2){
			shouldLoad = true;
		}else shouldLoad = false;
		this.wallSegments[i] = new WallSegment(this.context, x, 0, this.wallSize, i + 1, shouldLoad);
		if(shouldLoad){
			this.initWallSegments.push(this.wallSegments[i]);
		}
		x += this.wallSize;
	}
}

WallDrawing.prototype.updateImages = function(){
	
	var visibleWalls = this._getVisibleWalls();
	for(var i = 0; i < visibleWalls.length; i++){
		var visibleWall = visibleWalls[i];
		if(visibleWall.needsUpdate()){
			visibleWalls[i].updateImage();
		}
	}
}

//called onMouseUp if dragging tool was enabled. 
WallDrawing.prototype.loadImages = function(previousMouseX, mouseX){

	//the number of images to keep loaded to each
	//side of the frame
	var imagesToBuffer = 4;
	var visibleWalls = this._getVisibleWalls();

	//images dragged right, load left
	if(previousMouseX < mouseX){
		var leftVisibleWall = this._getLeftMostWall(visibleWalls);
		var leftWallIndex = leftVisibleWall.imageIndex - 1;

		//if we are not too close to the left most image
		if(leftWallIndex >= imagesToBuffer){
			for(var i = leftWallIndex; i > leftWallIndex - imagesToBuffer; i--){
				var wallSegment = this.wallSegments[i];
				if(!wallSegment.isLoaded()){
					wallSegment.loadImage();
					//console.log('I loaded an image to the left');
				}
			}
		}
		
	}else if(previousMouseX > mouseX){ //images dragged left, load right
		var rightVisibleWall = this._getRightMostWall(visibleWalls);
		var rightWallIndex = rightVisibleWall.imageIndex - 1;

		//if we are not too close to the right most image
		if(rightWallIndex <= this.wallSegments.length - imagesToBuffer){
			for(var i = rightWallIndex; i < rightWallIndex + imagesToBuffer; i++){
				var wallSegment = this.wallSegments[i];
				if(!wallSegment.isLoaded()){
					wallSegment.loadImage();
					//console.log('I loaded an image to the right');
				}
			}
		}
	}
}

WallDrawing.prototype.drag = function(previousMouseX, mouseX){

	var canDrag = false;

	//if dragged wall right
	if(previousMouseX < mouseX){
		if(this.wallSegments[0].x < 0){
			canDrag = true;
		}
	}else if(previousMouseX > mouseX){ //if dragged left
		var lastWallSegment = this.wallSegments[this.wallSegments.length - 1];
		if(lastWallSegment.x + lastWallSegment.size > this.canvas.width){
			canDrag = true;
		}
	}

	if(canDrag){
		this._walkWallSegments(function(wallSegment){
			wallSegment.update(previousMouseX, mouseX);
		});
		this.display();
	}
}

WallDrawing.prototype.display = function(){
	this._walkWallSegments(function(wallSegment){
		wallSegment.display();
	});
}

WallDrawing.prototype.notifyNeedsUpdate = function(previousMouseX, mouseX){
	this._walkWallSegments(function(wallSegment){
		if(wallSegment.inside(previousMouseX) ||
		   wallSegment.inside(mouseX)){
			wallSegment.notifyNeedsUpdate();
		}
	});
}

//returns true if initial images are loaded and checks 
//again if they arent
WallDrawing.prototype.initImagesLoaded = function(){
	if(this._initImagesLoaded) return true;
	else{
		var numbLoaded = 0;
		for(i = 0; i < this.initWallSegments.length; i++){
			var initWallSegment = this.initWallSegments[i];
			if(initWallSegment.isLoaded()) numbLoaded++;
		}

		//if all initial images have been loaded...
		if(numbLoaded != 0 &&
		   numbLoaded == this.initWallSegments.length) return true;
		else return false;
	}
}

//------------------------------------------------------------------------
//PROTECTED FUNCTIONS

//returns array of all wallSegements that are inside the canvas frame
WallDrawing.prototype._getVisibleWalls = function(){
		
	var visibleWalls = [];
	this._walkWallSegments(function(wallSegment){
		//if at least part of the wallSegment is in the canvas frame...
		if(wallSegment.x > 0 &&
		   wallSegment.x < this.canvas.width ||
		   wallSegment.x + wallSegment.size > 0 &&
		   wallSegment.x + wallSegment.size < this.canvas.width){
			visibleWalls.push(wallSegment);
		}
	});
	return visibleWalls;
}

WallDrawing.prototype._getLeftMostWall = function(wallSegmentsArray){
	var leftMostWall = wallSegmentsArray[0];
	for(var i = 0; i < wallSegmentsArray.length; i++){
		var wallSegment = wallSegmentsArray[i];
		if(Math.min(wallSegment.x, leftMostWall.x) == wallSegment.x) leftMostWall = wallSegment;
	}
	return leftMostWall;
}

WallDrawing.prototype._getRightMostWall = function(wallSegmentsArray){
	var rightMostWall = wallSegmentsArray[0];
	for(var i = 0; i < wallSegmentsArray.length; i++){
		var wallSegment = wallSegmentsArray[i];
		if(Math.max(wallSegment.x, rightMostWall.x) == wallSegment.x) rightMostWall = wallSegment;
	}
	return rightMostWall;
}

WallDrawing.prototype._walkWallSegments = function(fn){
	for(var i = 0; i < this.wallSegments.length; i++){
		var needsBreak = fn(this.wallSegments[i]);
		if(needsBreak) break;
	}
}