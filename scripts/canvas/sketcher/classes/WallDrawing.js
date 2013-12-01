function WallDrawing(canvas, numbImages){

	//pick a random wallIndex to start on
	//this.currentImageIndex = Math.ceil(Math.random()*numbImages-1);
	this.currentImageIndex = 1;
	this.wallSize = 512;
	this.wallSegments = [];
	this.canvas = canvas;
	
	var context = this.canvas.getContext('2d');
	var startX = this.canvas.width/2 - this.currentImageIndex * this.wallSize;
	var x = startX;

	for(var i = 0; i < numbImages; i++){
		var shouldLoad;
		if(i < 10){
			shouldLoad = true;
		}else shouldLoad = false;
		this.wallSegments[i] = new WallSegment(context, x, 0, this.wallSize, i, shouldLoad);
		x += this.wallSize;
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
		wallSegment.display();
	});
}

//returns the index of wall currently most in the frame of the canvas
WallDrawing.prototype.getCurrentWallIndex = function(){
	var index;
	this._walkWallSegments(function(wallSegment){
		if(wallSegment.x > 0 &&
		   wallSegment.x + wallSegment.size < this.canvas.width){
		   	index = wallSegment.imageIndex;
			return true; //breaks out of _walkWallSegments
		}
	});
	return index;
}

WallDrawing.prototype._walkWallSegments = function(fn){
	for(var i = 0; i < this.wallSegments.length; i++){
		var needsBreak = fn(this.wallSegments[i]);
		if(needsBreak) break;
	}
}