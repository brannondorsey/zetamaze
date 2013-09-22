//MAZE CLASS
function Maze(maze, stageWidth, stageHeight){
	this.width = maze[0].length;
	this.height = maze.length;
	this.blockSize = stageWidth/this.width;

	//construct maze
	this.blocks = [];
	var xPos = 0;
	var yPos = 0;

	for(var y = 0; y < this.height; y++){
		this.blocks[y] = [];
		for(var x = 0; x < this.width; x++){
			var index = x.toString()+","+y.toString();
			var state = (maze[y][x] == 1) ? true: false;
			this.blocks[y][x] = new Block(index, state, xPos, yPos, this.blockSize, this.blockSize);
			xPos += this.blockSize;
		}
		xPos = 0;
		yPos += this.blockSize;
	}
	
	this.locations = this.getLocations();
}

Maze.prototype.draw = function(layer){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
			layer.add(block.rect);
		}
	}
	layer.add(this.locations['begin'].rect);
	layer.add(this.locations['end'].rect);
}

Maze.prototype.toggleBlock = function(rectIndex, layer){
	var block = this.getBlockByIndex(rectIndex);
	block.toggleState();
	layer.draw();
}

Maze.prototype.recalculateLocation = function(rectIndex){
	var location;
	//find the location with the rectIndex
	for(var key in this.locations){
		if(this.locations[key].rect.index == rectIndex){
			location = this.locations[key];
			break;
		}
	}
	location.recalculate(this.width, this.blockSize);
}

Maze.prototype.export = function(){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
		}
	}
}

//make sure the maze is solvable
Maze.prototype.isSolvable = function(){

}

//------------------------------------------------------------------
//protected methods

//returns an assoc array of all of the mazes location objects
Maze.prototype.getLocations = function(){
	var locations = [];

	//set config constants
	var config = {
	 	w: this.blockSize,
		h: this.blockSize,
	 	blockSize: this.blockSize,
	 	mazeSize: this.blockSize * this.width
	}

	//set begin location
	config.x = this.blockSize+10;
	config.y = 10;
	config.mazeX = 1;
	config.mazeY = 0;
	config.primaryColor = 'green'
	locations['begin'] = new Location(config);

	//set end location
	config.x = this.blockSize*8;
	config.y = this.blockSize*6;
	config.mazeX = 1;
	config.mazeY = 0;
	config.primaryColor = 'red'
	locations['end'] = new Location(config);

	return locations;
}

//returns an object from blocks if its rect.id matches the parameter passed
Maze.prototype.getBlockByIndex = function(rectIndex){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			if(this.blocks[y][x].rect.index == rectIndex){
				return this.blocks[y][x];
			}
		}
	}
}

