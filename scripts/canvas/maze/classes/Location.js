/*
Example Location config...
{
	x: 100,
	y: 200,
	mazeX: 1,
	mazeY: 2,
	blockSize: 50,
	primaryColor: 'blue',
	mazeSize: 2000
}

 */

function Location(config){
    this.mazeX = config.mazeX;
    this.mazeY = config.mazeY;
    this.primaryColor = config.primaryColor;
    this.rect  = new Kinetic.Rect({
		x: config.x,
		y: config.y,
		width: config.blockSize,
		height: config.blockSize,
		fill: this.primaryColor,
		draggable: true,
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
}

//recalculates the mazeX and mazeY positions
Location.prototype.recalculate = function(mazeSize, blockSize){
	var centerX = this.rect.getX()+blockSize/2;
	var centerY = this.rect.getY()+blockSize/2;
	this.mazeX = Math.round(mapRange(centerX, 0, mazeSize*blockSize, 0, mazeSize) - 0.5);
	this.mazeY = Math.round(mapRange(centerY, 0, mazeSize*blockSize, 0, mazeSize) - 0.5);
	console.log("Maze coordinates: "+this.mazeX+", "+this.mazeY);
	console.log("Literal coordinates: "+this.rect.getX()+", "+this.rect.getY());
}
