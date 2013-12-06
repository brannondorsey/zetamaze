function CharacterController(scene, camera, position){
	
	this.speed = 5;
	this.lookSpeed = 100;
	this.flyEnabled = true;

	this.camera = camera;

	this.body = new THREE.Object3D();
	this.body.add(this.camera);
	console.log('position before: ');
	console.log(this.body.position);
	if(position != undefined) this.body.position = position;
	console.log('position after: ');
	console.log(this.body.position);	

	var boundingG = new THREE.CubeGeometry(40,80,40);
	// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
	// boundingG = new THREE.CylinderGeometry(20,20,80,8,2);
	// better collision but FPS drops too much
				
	boundingG.computeBoundingSphere();
	var boundingM = new THREE.MeshBasicMaterial( {color:0xff0000, transparent:true, wireframe:true} );
	this.bounding  = new THREE.Mesh( boundingG, boundingM );
	this.bounding.visible = false;
	this.body.add(this.bounding);
	
	this.body.velocity = new THREE.Vector3(0,0,0);
	
	scene.add(this.body);

	this.mouseLook = {x: 0, y: 0}
	this.keyboard = new THREEx.KeyboardState();
}

CharacterController.prototype.registerCollisionObjects = function(collisionObjects){
	this.wallArray = collisionObjects;
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
			this.body.velocity = new THREE.Vector3(0,0,0);
			this.body.translateY( moveDistance );
		}

		if ( this.keyboard.pressed('F') ){
			this.body.velocity = new THREE.Vector3(0,0,0);
			this.body.translateY( -moveDistance );
		}
	}	
	
	this.body.translateZ( move.zDist );
	this.body.rotateY( move.yAngle );
	this.body.translateX( move.xDist );
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
	
	// collision detection!
	var collisions = this.getCollisions();
	if (collisions != false ){
		for(var i = 0; i < collisions.length; i++){
			var colliderPosition = collision.mesh.position;
			var centerX = colliderPosition.x + 2.5;
		}
		this.body.translateX( -move.xDist );
		this.body.rotateY( -move.yAngle );
		this.body.translateZ( -move.zDist );
	 // this.body.updateMatrix();
		
	}
	
	this.body.updateMatrix();
}

CharacterController.prototype.mouseMove = function(e){

	var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
	var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

	// store movement amounts; will be processed by update function.
	this.mouseLook.x += movementX;
	this.mouseLook.y += movementY;
}

// returns true on intersection
CharacterController.prototype.getCollisions = function(){

	if(this.wallArray != undefined){
			/*
		// coarse collision detection, create a list of candidates to check thoroughly
		var candidates = [];
		for (var i = 0; i < walls.length; i++)
		{
			if ( person.position.distanceTo(wallArray[i].position) < 
					(person.children[1].geometry.boundingSphere.radius + wallArray[i].geometry.boundingSphere.radius) )
				candidates.push( wallArray[i] );
		}
		*/

		// send rays from center of person to each vertex in bounding geometry
		for (var vertexIndex = 0; vertexIndex < this.body.children[1].geometry.vertices.length; vertexIndex++){		

			var localVertex = this.body.children[1].geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( this.body.matrix );
			var directionVector = globalVertex.sub( this.body.position );
			
			var ray = new THREE.Raycaster( this.body.position, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects(this.wallArray);
			
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() - 1 ) 
				return collisionResults;
		}
		return false;
	}
}
