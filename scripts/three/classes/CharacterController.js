function CharacterController(scene, camera, position){
	
	this.speed = 3.5;
	this.lookSpeed = 100;
	this.flyEnabled = false;
	this.colliderPadding = 0.3;

	this.camera = camera;

	this.body = new THREE.Object3D();
	this.body.add(this.camera);
	
	if(position != undefined) this.body.position = position;

	this.x = this.body.position.x;
	this.z = this.body.position.z;

	scene.add(this.body);

	this.mouseLook = {x: 0, y: 0}
	this.keyboard = new THREEx.KeyboardState();
}

CharacterController.prototype.registerCollisionObjects = function(collisionObjects, blockSize){
	this.colliderMeshes = collisionObjects;
	this.blockSize = blockSize;
}

CharacterController.prototype.update = function(delta){

	var moveDistance = this.speed * delta; // 200 pixels per second  // should be velocity?
	var rotateAngle = Math.PI / 4 * delta;   // pi/4 radians (45 degrees) per second
	var cursorSpeed = this.cursorSpeed * delta;	
	
	// movement controls	
	var move = { 
		xDist: 0, 
		yAngle: 0, 
		zDist: 0 
	};				
	
	// forwards/backwards
	if (this.keyboard.pressed('W')) move.zDist -= moveDistance;
	if (this.keyboard.pressed('S')) move.zDist += moveDistance;
	// left/right (strafe)
	if ( this.keyboard.pressed('A') ) move.xDist -= moveDistance;
	if ( this.keyboard.pressed('D') ) move.xDist += moveDistance;

	// turn left/right
	if (this.keyboard.pressed('left')) move.yAngle += rotateAngle;
	if (this.keyboard.pressed('right')) move.yAngle -= rotateAngle;

	// look up/down
	if ( this.keyboard.pressed('up') ) this.camera.rotateX(  rotateAngle );
	if ( this.keyboard.pressed('down') ) this.camera.rotateX( -rotateAngle );
		
	// process data from mouse look
	//  (if inactive, there will be no change)
	move.yAngle -= rotateAngle * this.mouseLook.x * 0.1;
	this.mouseLook.x = 0;
	
	if(this.flyEnabled){
		// up/down (debugging fly)
		if ( this.keyboard.pressed('R') ){
			this.body.translateY( moveDistance );
		}

		if ( this.keyboard.pressed('F') ){
			this.body.translateY( -moveDistance );
		}
	}	
	
	var collisions = this.getCollisions();

	var previousX = this.getX();
	var previousZ = this.getZ();

	if(collisions == false ||
	   this._allowMovement(move, collisions)){
		this._move(move);
		this.body.updateMatrix();
	}
			
	// process data from mouse look
	//  (if inactive, there will be no change)
	this.camera.rotateX( -rotateAngle * this.mouseLook.y * 0.05 );
	this.mouseLook.y = 0;
		
	// limit camera to +/- 45 degrees (0.7071 radians) or +/- 60 degrees (1.04 radians)
	this.camera.rotation.x = THREE.Math.clamp( this.camera.rotation.x, -1.04, 1.04 );
	// pressing both buttons moves look angle to horizon
	if ( this.keyboard.pressed('R') && this.keyboard.pressed('F') )
		this.camera.rotateX( -6 * this.camera.rotation.x * rotateAngle );
	
	this.body.updateMatrix();
}

CharacterController.prototype.getX = function(){
	return this.body.position.x;
}

CharacterController.prototype.getY = function(){
	return this.body.position.y;
}

CharacterController.prototype.getZ = function(){
	return this.body.position.z;
}

CharacterController.prototype.mouseMove = function(e){

	var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
	var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

	// store movement amounts; will be processed by update function.
	this.mouseLook.x += movementX;
	this.mouseLook.y += movementY;
}

CharacterController.prototype.getCollisions = function(){

	var collisionDetected = false;
	var colliders = [];

	if(this.colliderMeshes != undefined){

		for(var i = 0; i < this.colliderMeshes.length; i++){

			var colliderMesh = this.colliderMeshes[i];
			var minX = colliderMesh.position.x - this.blockSize/2 - this.colliderPadding;
			var maxX = colliderMesh.position.x + this.blockSize/2 + this.colliderPadding;
			var minZ = colliderMesh.position.z - this.blockSize/2 - this.colliderPadding;
			var maxZ = colliderMesh.position.z + this.blockSize/2 + this.colliderPadding;

			//if collision has occurred
			if(this.getX() < maxX &&
			   this.getX() > minX &&
			   this.getZ() < maxZ &&
			   this.getZ() > minZ){

				colliders.push(colliderMesh);
			}
		}
	}
	return colliders.length > 0 ? colliders : false;
}

//boolean
CharacterController.prototype._allowMovement = function(movementObj, colliders){
	
	var allowMovement = true;

	this._move(movementObj);
	var x = this.getX();
	var z = this.getZ();
	this._unMove(movementObj);

	for(var i = 0; i < colliders.length; i++){

		var collider = colliders[i]; 
		var minX = collider.position.x - this.blockSize/2 - this.colliderPadding;
		var maxX = collider.position.x + this.blockSize/2 + this.colliderPadding;
		var minZ = collider.position.z - this.blockSize/2 - this.colliderPadding;
		var maxZ = collider.position.z + this.blockSize/2 + this.colliderPadding;

		//if collision has occurred
		if(x < maxX &&
		   x > minX &&
		   z < maxZ &&
		   z > minZ){
			allowMovement = false;
			break;
		}
	}
	return allowMovement;
}

CharacterController.prototype._move = function(movementObj){
	//perform translations and rotations in local space
	this.body.translateZ(movementObj.zDist);
	this.body.translateX(movementObj.xDist);
	this.body.rotateY(movementObj.yAngle);
}

CharacterController.prototype._unMove = function(movementObj){
	var reverseMovementObj = {};
	reverseMovementObj.xDist = -movementObj.xDist;
	reverseMovementObj.zDist = -movementObj.zDist;
	reverseMovementObj.yAngle = -movementObj.yAngle;
	this._move(reverseMovementObj);
}
