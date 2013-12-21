//MAZE CLASS
function Maze2D(maze, stageWidth){
	this.data = maze;
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
			var state = (maze[y][x] == 1) ? true : false;
			this.blocks[y][x] = new Block(index, state, xPos, yPos, this.blockSize, this.blockSize);
			xPos += this.blockSize;
		}
		xPos = 0;
		yPos += this.blockSize;
	}
}

//loads the state of the maze from the database into the maze object
Maze2D.prototype.initLocations = function(mazeData, locationsLoadedFunc){
	var self = this;
	var numbLoaded = 0;
	this.locations = [];
	
	//set config constants
	var config = {
	 	blockSize: this.blockSize,
	 	mazeSize: this.blockSize * this.width,
	 	onLoadFunc: function(){
	 		numbLoaded++;
	 		//if all images have now been loaded...
	 		if(numbLoaded == getAssocSize(self.locations)){
	 			//call the callback function included in method
	 			locationsLoadedFunc();
	 		}
	 	}
	}

	//set begin location
	config.x = parseFloat(mazeData.beginX);
	config.y = parseFloat(mazeData.beginY);
	config.mazeX = parseInt(mazeData.beginMazeX);
	config.mazeY = parseInt(mazeData.beginMazeY);
	config.imagePath = 'images/builder/begin.png';
	this.locations['begin'] = new Location(config);

	//set end location
	config.x = parseFloat(mazeData.endX);
	config.y = parseFloat(mazeData.endY);
	config.mazeX = parseInt(mazeData.endMazeX);
	config.mazeY = parseInt(mazeData.endMazeY);
	config.imagePath = 'images/builder/zip.png';
	this.locations['end'] = new Location(config);

	//set file1 location
	config.x = parseFloat(mazeData.file1X);
	config.y = parseFloat(mazeData.file1Y);
	config.mazeX = parseInt(mazeData.file1MazeX);
	config.mazeY = parseInt(mazeData.file1MazeY);
	config.imagePath = 'images/builder/file_1.png';
	this.locations['file1'] = new Location(config);

	//set file2 location
	config.x = parseFloat(mazeData.file2X);
	config.y = parseFloat(mazeData.file2Y);
	config.mazeX = parseInt(mazeData.file2MazeX);
	config.mazeY = parseInt(mazeData.file2MazeY);
	config.imagePath = 'images/builder/file_2.png';
	this.locations['file2'] = new Location(config);

	//set file3 location
	config.x = parseFloat(mazeData.file3X);
	config.y = parseFloat(mazeData.file3Y);
	config.mazeX = parseInt(mazeData.file3MazeX);
	config.mazeY = parseInt(mazeData.file3MazeY);
	config.imagePath = 'images/builder/file_3.png';
	this.locations['file3'] = new Location(config);

	//set file4 location
	config.x = parseFloat(mazeData.file4X);
	config.y = parseFloat(mazeData.file4Y);
	config.mazeX = parseInt(mazeData.file4MazeX);
	config.mazeY = parseInt(mazeData.file4MazeY);
	config.imagePath = 'images/builder/file_4.png';
	this.locations['file4'] = new Location(config);

	//test
	this.getTextureData();
}

//recalculates the state of the maze and returns the maze as a 
//2D array string
Maze2D.prototype.update = function(){
	var mazeData = [];
	for(var y = 0; y < this.blocks.length; y++){
		mazeData[y] = [];
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
			mazeData[y][x] = block.state ? 1 : 0;  
		}
	}
	this.data = mazeData;
	return JSON.stringify(this.data);
}

Maze2D.prototype.display = function(layer){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
			layer.add(block.rect);
		}
	}

	for(var key in this.locations){
		layer.add(this.locations[key].rect);
	}
}

Maze2D.prototype.toggleBlock = function(rectIndex, layer){
	var block = this._getBlockByIndex(rectIndex);
	block.toggleState();
	layer.draw();
}

Maze2D.prototype.recalculateLocation = function(rectIndex){
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

//saves the maze data to the hidden form
Maze2D.prototype.save = function(){

		//save the submit value because it gets changed by the below
		var submitValue = $("#maze-form input[type='submit']").val();
		
		//maze data
		$("#maze-form input[name='maze']").val(this.update());
		$("#maze-form input[name='textureData']").val(JSON.stringify(this.getTextureData()));

		//begin
		$("#maze-form input[name='beginX']").val(this.locations["begin"].rect.getX());
		$("#maze-form input[name='beginY']").val(this.locations["begin"].rect.getY());
		$("#maze-form input[name='beginMazeX']").val(this.locations["begin"].mazeX);
		$("#maze-form input[name='beginMazeY']").val(this.locations["begin"].mazeY);

		//end
		$("#maze-form input[name='endX']").val(this.locations["end"].rect.getX());
		$("#maze-form input[name='endY']").val(this.locations["end"].rect.getY());
		$("#maze-form input[name='endMazeX']").val(this.locations["end"].mazeX);
		$("#maze-form input[name='endMazeY']").val(this.locations["end"].mazeY);

		//files
		var arraySize = getAssocSize(this.locations);
		for(var i = 1; i < arraySize-1; i++){
			
			var result = $("#maze-form input#file"+i.toString());
	
			result.val(this.locations["file"+i.toString()].rect.getX());
			result = result.next();

			result.val(this.locations["file"+i.toString()].rect.getY());
			result = result.next();
			
			result.val(this.locations["file"+i.toString()].mazeX);
			result = result.next();
			
			result.val(this.locations["file"+i.toString()].mazeY);
			result = result.next();
		}

		//for some reason the value of the submit button is affected by the above code...
		$("#maze-form input[type='submit']").val(submitValue); //COME BACK
}

//make sure the maze is solvable
Maze2D.prototype.isSolvable = function(){
	var solver = new MazeSolver(this.data, 
							this.locations['begin'].mazeX,
							this.locations['begin'].mazeY,
							this.locations['end'].mazeX,
							this.locations['end'].mazeY)
	//solver.print();
	return solver.isSolvable();
}

Maze2D.prototype.getTextureData = function(){
	var solver = new MazeSolver(this.data,
								this.locations['begin'].mazeX,
								this.locations['begin'].mazeY,
								this.locations['end'].mazeX,
								this.locations['end'].mazeY);
	return solver.getTextureData();
}

//------------------------------------------------------------------
//protected methods

//returns an object from blocks if its rect.id matches the parameter passed
Maze2D.prototype._getBlockByIndex = function(rectIndex){
	for(var y = 0; y < this.blocks.length; y++){
		for(var x = 0; x < this.blocks[0].length; x++){
			if(this.blocks[y][x].rect.index == rectIndex){
				return this.blocks[y][x];
			}
		}
	}
}


