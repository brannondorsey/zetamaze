function CharacterController(scene, camera, position){
	
	this.speed = 3.5;
	this.lookSpeed = 100;
	this.flyEnabled = true;
	this.colliderPadding = 0.35;
	this.previousPosition;

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

	var moveDistance = Math.min(this.speed * delta, this.colliderPadding - 0.01); // 200 pixels per second  // should be velocity?
	if(moveDistance > this.colliderPadding) console.log(moveDistance);
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
		//save this as a safe position
	   	if(collisions == false) this.previousPosition = this.body.position.clone();
		this._move(move);
		this.body.updateMatrix();

		this.camera.rotateX( -rotateAngle * this.mouseLook.y * 0.05 );
		this.mouseLook.y = 0;
			
		// limit camera to +/- 45 degrees (0.7071 radians) or +/- 60 degrees (1.04 radians)
		this.camera.rotation.x = THREE.Math.clamp( this.camera.rotation.x, -1.04, 1.04 );
		this.body.updateMatrix();

	}else{ //there are collisions or movement isn't allowed...

		for(var i = 0; i < collisions.length; i++){
			var collider = collisions[i];
			//if the character is inside the collider (not just the padding) then 
			//bring it to the last safe position. This is hacky but I don't know how else to do this
			if(this._insideCollider(false, collider)) this.body.position = this.previousPosition;
		}	
	}
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
			if(this._insideCollider(true, colliderMesh)) colliders.push(colliderMesh);
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
		if(this._insideCollider(true, collider, x, z)){
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

CharacterController.prototype._insideCollider = function(usePadding, colliderMesh, x, z){

	var padding = (usePadding) ? this.colliderPadding : 0; 

	var minX = colliderMesh.position.x - this.blockSize/2 - padding;
	var maxX = colliderMesh.position.x + this.blockSize/2 + padding;
	var minZ = colliderMesh.position.z - this.blockSize/2 - padding;
	var maxZ = colliderMesh.position.z + this.blockSize/2 + padding;
	
	if(typeof x == 'undefined' &&
	   typeof z == 'undefined'){
		var x = this.getX();
		var z = this.getZ();
	}

	//if collision has occurred
	if(x < maxX &&
	   x > minX &&
	   z < maxZ &&
	   z > minZ){
	   	return true;
	}else return false;
}

