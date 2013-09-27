//MAZE CLASS
function Maze(maze, stageWidth, stageHeight){
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
			var state = (maze[y][x] == 1) ? true: false;
			this.blocks[y][x] = new Block(index, state, xPos, yPos, this.blockSize, this.blockSize);
			xPos += this.blockSize;
		}
		xPos = 0;
		yPos += this.blockSize;
	}
	
	//this.locations = this.getLocations();
}

//loads the state of the maze from the database into the maze object
Maze.prototype.initLocations = function(mazeData){
	this.locations = [];

	//set config constants
	var config = {
	 	blockSize: this.blockSize,
	 	mazeSize: this.blockSize * this.width
	}

	//set begin location
	config.x = parseFloat(mazeData.beginX);
	config.y = parseFloat(mazeData.beginY);
	config.mazeX = parseInt(mazeData.beginMazeX);
	config.mazeY = parseInt(mazeData.beginMazeY);
	config.primaryColor = 'green'
	this.locations['begin'] = new Location(config);

	//set end location
	config.x = parseFloat(mazeData.endX);
	config.y = parseFloat(mazeData.endY);
	config.mazeX = parseInt(mazeData.endMazeX);
	config.mazeY = parseInt(mazeData.endMazeY);
	config.primaryColor = 'red'
	this.locations['end'] = new Location(config);

	//set file1 location
	config.x = parseFloat(mazeData.file1X);
	config.y = parseFloat(mazeData.file1Y);
	config.mazeX = parseInt(mazeData.file1MazeX);
	config.mazeY = parseInt(mazeData.file1MazeY);
	config.primaryColor = 'grey'
	this.locations['file1'] = new Location(config);

	//set file2 location
	config.x = parseFloat(mazeData.file2X);
	config.y = parseFloat(mazeData.file2Y);
	config.mazeX = parseInt(mazeData.file2MazeX);
	config.mazeY = parseInt(mazeData.file2MazeY);
	config.primaryColor = 'grey'
	this.locations['file2'] = new Location(config);

	//set file3 location
	config.x = parseFloat(mazeData.file3X);
	config.y = parseFloat(mazeData.file3Y);
	config.mazeX = parseInt(mazeData.file3MazeX);
	config.mazeY = parseInt(mazeData.file3MazeY);
	config.primaryColor = 'grey'
	this.locations['file3'] = new Location(config);

	//set file4 location
	config.x = parseFloat(mazeData.file4X);
	config.y = parseFloat(mazeData.file4Y);
	config.mazeX = parseInt(mazeData.file4MazeX);
	config.mazeY = parseInt(mazeData.file4MazeY);
	config.primaryColor = 'grey'
	this.locations['file4'] = new Location(config);
}

Maze.prototype.draw = function(layer){
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

//checks to make sure that the maze is solvable and then exports the data to the hidden form
Maze.prototype.export = function(){
	if(this.isSolvable()){

		//save the submit value because it gets changed by the below
		var submitValue = $("#maze-form input[type='submit']").val();
		
		//maze data
		$("#maze-form input[name='maze']").val(this.getNewMazeData());

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
		return true;
	}
	return false;
}

//make sure the maze is solvable
Maze.prototype.isSolvable = function(){
	solver = new MazeSolver(this.data, 
							this.locations['begin'].mazeX,
							this.locations['begin'].mazeY,
							this.locations['end'].mazeX,
							this.locations['end'].mazeY)
	//solver.print();
	return solver.isSolvable();
}

//------------------------------------------------------------------
//protected methods

//returns an assoc array of all of the mazes location objects
Maze.prototype.getLocations = function(){
	// var locations = [];

	// //set config constants
	// var config = {
	//  	w: this.blockSize,
	// 	h: this.blockSize,
	//  	blockSize: this.blockSize,
	//  	mazeSize: this.blockSize * this.width
	// }

	// //set begin location
	// config.x = this.blockSize+10;
	// config.y = 10;
	// config.mazeX = 1;
	// config.mazeY = 1;
	// config.primaryColor = 'green'
	// locations['begin'] = new Location(config);

	// //set end location
	// config.x = this.blockSize*8;
	// config.y = this.blockSize*6;
	// config.mazeX = 5;
	// config.mazeY = 5;
	// config.primaryColor = 'red'
	// locations['end'] = new Location(config);

	// //set begin location
	// config.x = this.blockSize+100;
	// config.y = this.blockSize;
	// config.mazeX = 1;
	// config.mazeY = 0;
	// config.primaryColor = 'grey'
	// locations['file1'] = new Location(config);

	// //set begin location
	// config.x = this.blockSize*3+100;
	// config.y = this.blockSize*5;
	// config.mazeX = 1;
	// config.mazeY = 5;
	// config.primaryColor = 'grey'
	// locations['file2'] = new Location(config);

	// return locations;
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

//exports the state of the maze walls in a 2D JSON array
Maze.prototype.getNewMazeData = function(){
	var mazeData = [];
	for(var y = 0; y < this.blocks.length; y++){
		mazeData[y] = [];
		for(var x = 0; x < this.blocks[0].length; x++){
			var block = this.blocks[y][x];
			mazeData[y][x] = block.state ? 1 : 0;  
		}
	}
	return JSON.stringify(mazeData);
}



