function Maze3D(hostname, scene, mazeObj, block3DSize, pathToImagesFolder, pathToModelsFolder){
	
	this.hostname = hostname;
	this.scene = scene;
	this.pathToModelsFolder = pathToModelsFolder;
	this.pathToImagesFolder = pathToImagesFolder;
	this.fillerImage = "filler_image.png";
	this.imagePrefix = "test_image_";
	this.imageType = ".png";
	this.date = new Date();


	this.mazeObj = mazeObj;
	this.data = JSON.parse(mazeObj.maze);
	this.width = this.data[0].length;
	this.height = this.data.length;
	this.block3DSize = block3DSize;
	this.textureData = JSON.parse(mazeObj.textureData);

	this.locations3D = [];

	//construct maze
	this.blocks3D = [];
	var xPos = 0;
	var yPos = 0;
	var zPos = 0;

	for(var z = 0; z < this.height; z++){
		this.blocks3D[z] = [];
		for(var x = 0; x < this.width; x++){
			var index = x.toString()+","+z.toString();
			var state = (this.data[z][x] == 1) ? true: false;
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

	this._initLocations();
}

Maze3D.prototype.update = function(delta){

	var self = this;
	this._walkLocations(function(location, key){
		var characterX = character.getX();
		var characterZ = character.getZ();
		if(location.hit(characterX, characterZ)){
			location.destroy();
			if(location.hasObject() &&
			   location.isLoaded()){
				location.onHitFunc();
			}
			delete self.locations3D[key];
		}else location.update(delta);
	});
}

//this should probably be init()
Maze3D.prototype.addToScene = function(){
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

Maze3D.prototype.getBlockSize = function(){
	return this.block3DSize;
}

//used to initialize character controller's position
Maze3D.prototype.getBeginPosition = function(){
	var x = this.locations3D['begin'].x;
	var y = this.locations3D['begin'].y;
	var z = this.locations3D['begin'].z;
	return new THREE.Vector3(x, y, z);
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

Maze3D.prototype._walkLocations = function(walkFunction){
	var assocArrayLength = Object.keys(this.locations3D).length;
	if(assocArrayLength > 0){
		for(var key in this.locations3D){
			walkFunction(this.locations3D[key], key);
		}
	}
}

Maze3D.prototype._initLocations = function(){

	var self = this;

	//set config defaults
	var config = {
		scene: this.scene,
		y: 0
	};

	//begin
	config.color = 0x00ff00;
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.beginMazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.beginMazeY));
	this.locations3D['begin'] = new Location3D(config);

	//end
	config.color = 0xff0000;
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.endMazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.endMazeY));
	config.objPath = this.pathToModelsFolder + 'zip.obj';
	config.matPath = this.pathToModelsFolder + 'zip.mtl';
	config.onHitFunc = function(){
		console.log('hit the end!');
	}
	this.locations3D['end'] = new Location3D(config);

	//file1
	config.color = 0x686868;
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.file1MazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.file1MazeY));
	config.objPath = this.pathToModelsFolder + 'file.obj';
	config.matPath = this.pathToModelsFolder + 'file.mtl';
	config.onHitFunc = function(){
		self._promptFileDownload('file1');
	}
	this.locations3D['file1'] = new Location3D(config);

	//file2
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.file2MazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.file2MazeY));
	config.objPath = this.pathToModelsFolder + 'file.obj';
	config.matPath = this.pathToModelsFolder + 'file.mtl';
	config.onHitFunc = function(){
		self._promptFileDownload('file2');
	}
	this.locations3D['file2'] = new Location3D(config);

	//file3
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.file3MazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.file3MazeY));
	config.objPath = this.pathToModelsFolder + 'file.obj';
	config.matPath = this.pathToModelsFolder + 'file.mtl';
	config.onHitFunc = function(){
		self._promptFileDownload('file3');
	}
	this.locations3D['file3'] = new Location3D(config);

	//file4
	config.x = this._toMaze3DCoords(JSON.parse(this.mazeObj.file4MazeX));
	config.z = this._toMaze3DCoords(JSON.parse(this.mazeObj.file4MazeY));
	config.objPath = this.pathToModelsFolder + 'file.obj';
	config.matPath = this.pathToModelsFolder + 'file.mtl';
	config.onHitFunc = function(){
		self._promptFileDownload('file4');
	}
	this.locations3D['file4'] = new Location3D(config);
	
}

Maze3D.prototype._toMaze3DCoords = function(maze2DValue){
	return maze2DValue * this.block3DSize;
}

//used when items are hit
Maze3D.prototype._promptFileDownload = function(filename){

	//note: filename at the point that it is passed in does not include extension!
	var self = this;
	$.ajax({
		url: self.hostname + '/zeta/itemnames.php',
		method: 'post',
		data: filename,
		success: function(response){

			console.log("first response succeeded!");
			var itemNames = response;
			console.log(itemNames);
			for(var i = 0; i < itemNames.length; i++){

				var periodIndex = itemNames[i].indexOf('.');
				var filenameWithExt = itemNames[i].substring(0, periodIndex);

				if(filename == filenameWithExt){

					//download the file! 
					window.location = self.hostname + "/zeta/promptdownload.php?filename=" + itemNames[i];
				}
			}
		}
	});
}

