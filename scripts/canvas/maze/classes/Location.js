/*
Example Location config...
{
	x: 100,
	y: 200,
	mazeX: 1,
	mazeY: 2,
	blockSize: 50,
	imagePath: 'images/example.png',
	mazeSize: 2000
}

 */

function Location(config){
	var self = this;
	var x = config.x;
	var y = config.y;
	var imagePath = config.imagePath;
	var onLoadFunc = config.onLoadFunc;
    this.mazeX = config.mazeX;
    this.mazeY = config.mazeY;
    var imageObj = new Image();
    imageObj.src = imagePath;
    imageObj.onload = function(){
    	self.rect  = new Kinetic.Image({
			x: x,
			y: y,
			width: config.blockSize,
			height: config.blockSize,
			draggable: true,
			image: imageObj,
			dragBoundFunc: function(pos){
				var xBound;
				var yBound;
				if(pos.x < config.blockSize) xBound = config.blockSize;
				else if(pos.x+config.blockSize > config.mazeSize-config.blockSize) xBound = config.mazeSize-config.blockSize*2;
				else xBound = pos.x;
				if(pos.y < config.blockSize) yBound = config.blockSize;
				else if(pos.y+config.blockSize > config.mazeSize-config.blockSize) yBound = config.mazeSize-config.blockSize*2;
				else yBound = pos.y;
				return{
					x: xBound,
					y: yBound
				}
			}
		});
		onLoadFunc();
    }
}

//recalculates the mazeX and mazeY positions
Location.prototype.recalculate = function(mazeSize, blockSize){
	var centerX = this.rect.getX()+blockSize/2;
	var centerY = this.rect.getY()+blockSize/2;
	this.mazeX = Math.round(mapRange(centerX, 0, mazeSize*blockSize, 0, mazeSize) - 0.5);
	this.mazeY = Math.round(mapRange(centerY, 0, mazeSize*blockSize, 0, mazeSize) - 0.5);
	// console.log("Maze coordinates: "+this.mazeX+", "+this.mazeY);
	// console.log("Literal coordinates: "+this.rect.getX()+", "+this.rect.getY());
}
