function ErrorHandler(){
	this.errors = [];
}

ErrorHandler.prototype.addError = function(message){
	this.errors.push(message);
}

ErrorHandler.prototype.reset = function(containerSelector){
	this.errors = [];
	if(typeof containerSelector !== 'undefined'){
		$(containerSelector).removeAttr("visibility");
	}
}

ErrorHandler.prototype.clearErrorBox = function(containerSelector){
	var container = $(containerSelector);
	container.empty(); //clear content
}

ErrorHandler.prototype.outputErrors = function(containerSelector, tagName){
	var container = $(containerSelector);
	for(var i = 0; i < this.errors.length; i++){
		var html = "<" + tagName + ">" + this.errors[i] + "</" + tagName + ">";
		container.append(html);
	}
	container.attr("visibility", "hidden");
}

//boolean that checks if errors exist and returns true if they do
ErrorHandler.prototype.checkErrors = function(maze, locations){
	this.maze = maze;
	this.locations = locations;
	this.checkLocationValidaty(this.locations);
	if(this.errorsExist()) return true;
	else{ //check for more errors
		for(var key in this.locations){
			if(key == 'begin') continue; //skip begin because begin point doesnt need to be compared to itself
			var solver = new MazeSolver(this.maze,
										this.locations['begin'].mazeX,
										this.locations['begin'].mazeY,
										this.locations[key].mazeX,
										this.locations[key].mazeY);
			if(!solver.isSolvable()){
				this.addError(key + " cannot be reached");	
			}else console.log(key + " can be reached"); 
		}
		if(this.errorsExist()) return true;
	}
	return false; //no errors were found
}

ErrorHandler.prototype.checkLocationValidaty = function(locations){
	for(var key in locations){
		var location = locations[key];
		if(this.maze[location.mazeY][location.mazeX] == 1){
			this.addError("This location is not allowed");
		}
	}
}

ErrorHandler.prototype.errorsExist = function(){
	return (this.errors.length > 0) ? true : false;
}

