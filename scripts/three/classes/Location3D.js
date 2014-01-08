function Location3D(config){

	this.rotationSpeed = 1;

	this.scene = config.scene;
	this.onHitFunc = config.onHitFunc;
	this._isLoaded = false;
	this._hasObject = false;
	this.phisical = config.phisical; //anything but start location is true
	this._ghosted = false;

	var x = config.x;
	var y = config.y;
	var z = config.z;

	this.x = x;
	this.y = y;
	this.z = z;

	this.scale = new THREE.Vector3(0.25, 0.25, 0.25);

	if(config.objPath != undefined &&
	   config.matPath != undefined){

		//when models are ready...
		var self = this;
		this._hasObject = true;
		var loader = new THREE.OBJMTLLoader();
		
		loader.load(config.objPath, config.matPath, function(object){
			self.object = object;

			self.object.position.x = self.x;
			self.object.position.y = self.y;
			self.object.position.z = self.z;
			self.object.scale = self.scale;
			self._isLoaded = true;
			self._hasObject = true;
			self.scene.add(self.object);
		});

	}else{
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
	}
}

//constant rotation around y axis
Location3D.prototype.update = function(delta){

	if(this.hasObject() &&
	   this.isLoaded()){

		this.object.rotateY(this.rotationSpeed * delta);
		this.object.updateMatrix();
	}
}

//if character is near the location object
Location3D.prototype.hit = function(x, z){
	if(this.phisical){
		var distance = 1.5;
		var point1 = {x: x, y: z};
		var point2 = {x: this.x, y: this.z};
		var t = dist(point1, point2);
		return (t < distance);
	}else return false;
}

Location3D.prototype.ghost = function(){
	var opacity = 0.3;
	for(var i = 0; i < this.object.children.length; i++){
		var material = this.object.children[i].material;
		material.transparent = true;
		material.opacity = opacity
	}	 
}

Location3D.prototype.isGhosted = function(){
	return this._ghosted;
}

Location3D.prototype.setGhosted = function(bool){
	this._ghosted = bool;
}

Location3D.prototype.destroy = function(){
	this.scene.remove(this.object);
}

Location3D.prototype.isLoaded = function(){
	return this._isLoaded;
}

Location3D.prototype.hasObject = function(){
	return this._hasObject;
}