//MAZE CLASS
function Maze(maze, blockSize, beginLocation, endLocation){
	this.width = maze[0].length;
	this.height = maze.length;
	this.blockSize = blockSize;
	this.begin = beginLocation;
	this.end =  endLocation;
	this.blocks = [];
	var xPos = 0;
	var yPos = 0;

	for(var y = 0; y < this.height; y++){
		this.blocks[y] = [];
		for(var x = 0; x < this.width; x++){
			var index = x.toString()+","+y.toString();
			var state = (maze[y][x] == 1) ? true: false;
			this.blocks[y][x] = new Block(index, state, xPos, yPos, blockSize, blockSize);
			xPos += this.blockSize;
		}
		xPos = 0;
		yPos += this.blockSize;
	}
}

Maze.prototype.draw = function(layer){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
			layer.add(block.rect);
		}
	}
}

Maze.prototype.toggleBlock = function(rectIndex, layer){
	for(var y = 1; y < this.blocks.length-1; y++){
		for(var x = 1; x < this.blocks[0].length-1; x++){
			if(this.blocks[y][x].rect.index == rectIndex){
				this.blocks[y][x].toggleState();
				layer.draw();
				break;
			}
		}
	}
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
