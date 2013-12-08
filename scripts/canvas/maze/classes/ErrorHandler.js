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
	this.checkWallsConnected(maze);
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

//uses flood fill algorithm with recursion to check if all
//maze walls are connected
ErrorHandler.prototype.checkWallsConnected = function(maze){

	var currentX = 0;
	var currentY = 0;

	this._floodFill(maze, 1, 2);

	var islandsExist = false;
	for(var y = 0; y < maze.length; y++){

		var shouldBreak = false;
		for(var x = 0; x < maze[0].length; x++){
			if(maze[y][x] == 1){
				islandsExist = true;
				shouldBreak = true;
				break;
			}
		}
		if(shouldBreak) break;
	}

	if(islandsExist) this.addError('All walls must be connected');
}

ErrorHandler.prototype.errorsExist = function(){
	return (this.errors.length > 0) ? true : false;
}

ErrorHandler.prototype._floodFill = function(maze, x, y){

	var target = 1;
	var replacement = 2;
	
	if(y > 0)									      var up = maze[y - 1][x];
    if(y > 0 && x < maze[0].length - 1) 		      var upRight = maze[y - 1][x + 1];
    if(x < maze[0].length - 1) 					      var  right = maze[y][x + 1];
    if(y < maze.length - 1 && x < maze[0].length - 1) var rightDown = maze[y + 1][x + 1];
    if(y < maze.length - 1) 					      var down = maze[y + 1][x];
    if(y < maze.length - 1 && x > 0) 			      var downLeft  = maze[y + 1][x - 1];
    if(x > 0) 									      var left = maze[y][x - 1];
    if(y > 0 && x > 0) 							      var leftUp  = maze[y - 1][x - 1];

    maze[y][x] = replacement;

    if(up != undefined &&
       up == target) this._floodFill(maze, x, y - 1);
    if(upRight != undefined &&
       upRight == target) this._floodFill(maze, x + 1, y - 1);
    if(right != undefined &&
       right == target) this._floodFill(maze, x + 1, y);
    if(rightDown != undefined &&
       rightDown == target) this._floodFill(maze, x + 1, y + 1);
    if(down != undefined &&
       down == target) this._floodFill(maze, x, y + 1);
    if(downLeft != undefined &&
       downLeft == target) this._floodFill(maze, x - 1, y + 1);
    if(left != undefined &&
       left == target) this._floodFill(maze, x - 1, y);
    if(leftUp != undefined &&
       leftUp == target) this._floodFill(maze, x - 1, y - 1);
}

