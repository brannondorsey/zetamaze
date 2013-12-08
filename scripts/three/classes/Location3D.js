function Location3D(config){

	this.rotationSpeed = .4;

	this.scene = config.scene;
	this.onHitFunc = config.onHitFunc;
	this._isLoaded = false;
	this._hasObject = false;

	if(config.objPath != undefined &&
	   config.matPath != undefined){

		//when models are ready...
		// var self = this;
		// this._hasObject = true;
		// var loader = new THREE.OBJMTLLoader();
		
		// loader.load(config.objPath, config.matPath, function(object){
		// 	self.object = object;

		// 	self.object.position.x = config.x;
		// 	self.object.position.y = config.y;
		// 	self.x = self.object.position.x;
		// 	self.z = self.object.position.z;
		// 	scene.add(self.object);
		// 	console.log('I added an object to the scene');
		// 	console.log('x: ' + self.x);
		// 	console.log('y: ' + self.z);
		// });
		
		//temporary...
		var cubeSize = 1.5;

		var geometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
		var material = new THREE.MeshPhongMaterial({ color: config.color, 
													 specular: 0xffffff, 
													 shininess: 20, 
													 shading: THREE.FlatShading });

		this.object = new THREE.Mesh(geometry, material);
		this.object.position = new THREE.Vector3(config.x, config.y, config.z);
		this.scene.add(this.object);

		this.x = this.object.position.x;
		this.z = this.object.position.z;
		this._isLoaded = true;
		this._hasObject = true;

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
	var distance = 1.7;
	var point1 = {x: x, y: z};
	var point2 = {x: this.x, y: this.z};
	var t = dist(point1, point2);
	return (t < distance);
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