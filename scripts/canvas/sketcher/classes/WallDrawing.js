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
	
	var visibleWalls = this._getVisibleWalls();
	for(var i = 0; i < visibleWalls.length; i++){
		var visibleWall = visibleWalls[i];
		visibleWalls[i].updateImage();
	}
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

WallDrawing.prototype._walkWallSegments = function(fn){
	for(var i = 0; i < this.wallSegments.length; i++){
		var needsBreak = fn(this.wallSegments[i]);
		if(needsBreak) break;
	}
}