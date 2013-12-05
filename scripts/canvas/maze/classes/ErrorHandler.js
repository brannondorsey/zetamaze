function ErrorHandler(){
	this.errors = [];
	this.errorHtmlParent = $("div.maze-container div.error-box");
}

ErrorHandler.prototype.addError = function(message){
	this.errors.push(message);
}

ErrorHandler.prototype.reset = function(){
	this.errors = [];
}

ErrorHandler.prototype.clearErrorBox = function(containerSelector){
	var container = $(containerSelector);
	this.errorHtmlParent.children("ul").remove(); //clear content
}

ErrorHandler.prototype.outputErrors = function(){
	var container = this.errorHtmlParent.append("<ul></ul>").children("ul");
	for(var i = 0; i < this.errors.length; i++){
		var html = "<li>" + this.errors[i] + "</li>";
		container.append(html);
	}
}

//boolean that checks if errors exist and returns true if they do
ErrorHandler.prototype.checkErrors = function(maze, locations){
	this.maze = maze;
	this.locations = locations;
	this.checkLocationvalidity(this.locations);
	this.checkWallsConnected(this.maze);
	if(this.errorsExist()) return true;
	else{ //check for more errors
		for(var key in this.locations){
			if(key == 'begin') continue; //skip begin because begin point doesnt need to be compared to itself
			var solver = new MazeSolver(this.maze,
										this.locations['begin'].mazeX,
										this.locations['begin'].mazeY,
										this.locations[key].mazeX,
										this.locations[key].mazeY);
			if(!solver.isSolvable()) this.addError(key.capitalize() + " cannot be reached");	
		}

		if(this.errorsExist()) return true;
	}
	return false; //no errors were found
}

ErrorHandler.prototype.checkLocationvalidity = function(locations){
	for(var key in locations){
		var location = locations[key];
		if(this.maze[location.mazeY][location.mazeX] == 1){
			this.addError("This location is not allowed");
		}
	}
}

ErrorHandler.prototype.checkWallsConnected = function(maze){

	console.log('got in here');

	var shouldBreak = false;
	//don't check the outer rim
	for(var y = 1; y < maze.length - 1; y++{
		if(!shouldBreak){
			for(var x = 1; x < maze[0].length - 1; x++){

				//if this wall is on...
				if(maze[y][x] == 1){

					//check to make sure that one of the 
					//8 ajacent walls is also on...
					var up        = maze[y - 1][x];
					var upRight   = maze[y - 1][x + 1];
					var right     = maze[y][x + 1];
					var rightDown = maze[y + 1][x + 1];
					var down      = maze[y + 1][x];
					var downLeft  = maze[y + 1][y - 1];
					var left      = maze[y][x - 1];
					var leftUp    = maze[y - 1][x - 1];

					if(up == 1 ||
					   upRight == 1 ||
					   right == 1 ||
					   rightDown == 1 ||
					   down == 1 ||
					   downLeft == 1 ||
					   left == 1 ||
					   leftUp == 1){
						continue;
					}else{
						this.addError('All walls must be connected');
						shouldBreak = true;
						break;
					}
				}
			}
		}
	}
}

ErrorHandler.prototype.errorsExist = function(){
	return (this.errors.length > 0) ? true : false;
}



