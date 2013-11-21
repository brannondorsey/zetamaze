function Maze3D(maze, block3DSize){
	this.data = maze;
	this.width = maze[0].length;
	this.height = maze.length;
	this.block3DSize = block3DSize;

	//construct maze
	this.blocks3D = [];
	var xPos = 0;
	var yPos = 0;
	var zPos = 0;

	for(var z = 0; z < this.height; z++){
		this.blocks3D[z] = [];
		for(var x = 0; x < this.width; x++){
			var index = x.toString()+","+z.toString();
			var state = (maze[z][x] == 1) ? true: false;
			if(state) this.blocks3D[z][x] = new Block3D(xPos, yPos, zPos, this.block3DSize, this.block3DSize, this.block3DSize);
			xPos += this.block3DSize;
		}
		xPos = 0;
		zPos += this.block3DSize;
	}
}

Maze3D.prototype.draw = function(scene){
	for(var z = 0; z < this.blocks3D.length; z++){
		for(var x = 0; x < this.blocks3D[0].length; x++){
			var block3D = this.blocks3D[z][x];
			if(typeof block3D !== 'undefined'){
				console.log(block3D);
				scene.add(block3D.cube);
			}
		}
	}	
}

//walks through a function with all blocks
Maze3D.prototype.walkBlocks = function(walkFunction){
	for(var z = 0; z < this.blocks3D.length; z++){
		for(var x = 0; x < this.blocks3D[0].length; x++){
			var block3D = this.blocks3D[z][x];
			//console.log(block3D);
			walkFunction(block3D.cube);
		}
	}	
}
