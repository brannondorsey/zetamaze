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

ErrorHandler.prototype.errorsExist = function(){
	return (this.errors.length > 0) ? true : false;
}

//boolean that checks if errors exist and 
ErrorHandler.prototype.checkErrors = function(maze, locations){
	this.maze = maze;
	this.locations = locations;
	this.checkLocationValidaty(this.locations);
	return this.errorsExist();
}

ErrorHandler.prototype.checkLocationValidaty = function(locations){
	for(var key in locations){
		var location = locations[key];
		console.log("tried");
		if(this.maze[location.mazeY][location.mazeX] == 1){
			this.addError("This location is not allowed");
		}
	}
}

