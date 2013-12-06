function Maze3D(maze, block3DSize, textureData, pathToImagesFolder){
	
	this.pathToImagesFolder = pathToImagesFolder;
	this.fillerImage = "filler_image.png";
	this.imagePrefix = "test_image_";
	this.imageType = ".png";
	this.date = new Date();

	this.data = maze;
	this.width = maze[0].length;
	this.height = maze.length;
	this.block3DSize = block3DSize;
	this.textureData = textureData;

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
			var blockTextureData = this.textureData[z][x];
			var textureNames = [];
			for(var i = 0; i < blockTextureData.length; i++){
				if (blockTextureData[i] != 0) {

					textureNames[i] = this.pathToImagesFolder +
									  this.imagePrefix +
									  zeroPad(blockTextureData[i], 4) +
									  this.imageType +
									  '?time=' + this.date.getTime(); //included so that cached images aren't used

				}else textureNames[i] = 0;	
			}
			if(state) this.blocks3D[z][x] = new Block3D(xPos, yPos, zPos, this.block3DSize, this.block3DSize, this.block3DSize, textureNames);
			xPos += this.block3DSize;
		}
		xPos = 0;
		zPos += this.block3DSize;
	}
}

//this should probably be init()
Maze3D.prototype.addToScene = function(scene){
	for(var z = 0; z < this.blocks3D.length; z++){
		for(var x = 0; x < this.blocks3D[0].length; x++){
			var block3D = this.blocks3D[z][x];
			if(typeof block3D !== 'undefined'){
				scene.add(block3D.cube);
			}
		}
	}	
}

//finds the mesh objects of all block3Ds and returns them as an array
Maze3D.prototype.getBlockMeshes = function(){
	var blocks = [];
	this.walkBlocks(function(block){
		blocks.push(block.cube);
	});
	return blocks;
}

Maze3D.prototype.getBlocks = function(){
	return this.blocks3D;
}

//walks through a function with all blocks
Maze3D.prototype.walkBlocks = function(walkFunction){
	for(var z = 0; z < this.blocks3D.length; z++){
		for(var x = 0; x < this.blocks3D[0].length; x++){
			var block3D = this.blocks3D[z][x];
			//console.log(block3D);
			if(block3D != undefined){
				walkFunction(block3D);
			}
			
		}
	}	
}
