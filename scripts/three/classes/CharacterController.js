function CharacterController(scene, camera, position){
	
	this.speed = 3;
	this.lookSpeed = 100;
	this.flyEnabled = true;

	this.camera = camera;

	this.body = new THREE.Object3D();
	this.body.add(this.camera);
	
	if(position != undefined) this.body.position = position;

	this.x = this.body.position.x;
	this.z = this.body.position.z;

	scene.add(this.body);

	this.mouseLook = {x: 0, y: 0}
	this.keyboard = new THREEx.KeyboardState();

	this._resetMovementLimits();

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
	
	var collisions = this.checkCollisions();

	var previousX = this.body.position.x;
	var previousZ = this.body.position.z;

	//perform translations and rotations in local space
	this.body.translateZ(move.zDist);
	this.body.translateX(move.xDist);
	this.body.rotateY(move.yAngle);
	
	if(collisions) this.restrictMovement(previousX, previousZ, move);
	this.body.updateMatrix();
		
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

CharacterController.prototype.checkCollisions = function(){

	var collisionDetected = false;
	var colliderPadding = .3;
	this._resetMovementLimits();

	if(this.colliderMeshes != undefined){

		for(var i = 0; i < this.colliderMeshes.length; i++){

			var colliderMesh = this.colliderMeshes[i];
			var minX = colliderMesh.position.x - this.blockSize/2 - colliderPadding;
			var maxX = colliderMesh.position.x + this.blockSize/2 + colliderPadding;
			var minZ = colliderMesh.position.z - this.blockSize/2 - colliderPadding;
			var maxZ = colliderMesh.position.z + this.blockSize/2 + colliderPadding;

			//if collision has occurred
			if(this.body.position.x < maxX &&
			   this.body.position.x > minX &&
			   this.body.position.z < maxZ &&
			   this.body.position.z > minZ){

				collisionDetected = true;

				var wallCenter = new THREE.Vector2(colliderMesh.position.x, colliderMesh.position.z);
				var bodyCenter = new THREE.Vector2(this.body.position.x, this.body.position.z);
				
				var direction = wallCenter.sub(bodyCenter);
				var x = direction.x;
				var y = direction.y;

				if (Math.abs(y) > Math.abs(x)) {
				  if (y > 0) this.limitZPos = true;
				  else this.limitZNeg = true;
				} else {
				  if (x > 0) this.limitXPos = true; 
				  else this.limitXNeg = true;
				}
			}
		}
	}
	return collisionDetected;
}

CharacterController.prototype.restrictMovement = function(previousX, previousZ, move){
	
	if(this.limitXPos) console.log('limiting positive x');
	if(this.limitXNeg) console.log('limiting negative x');
	if(this.limitZPos) console.log('limiting positive z');
	if(this.limitZNeg) console.log('limiting negative z');
	
	var newX = this.body.position.x;
	var newZ = this.body.position.z;

	console.log('difference x: ' + (previousX - newX));
	//checks world coordinates after local translation
	if(this.limitXPos && newX > previousX ||
	   this.limitXNeg && newX < previousX){
	   	//resets translation if move should be restricted
		this.body.translateX(-move.xDist);
	}

	if(this.limitZPos && newZ > previousZ ||
	   this.limitZNeg && newZ < previousZ){
		this.body.translateZ(-move.zDist);
	}
	
}

CharacterController.prototype._resetMovementLimits = function(){
	this.limitXPos = false;
	this.limitXNeg = false;
	this.limitZPos = false;
	this.limitZNeg = false;
}
