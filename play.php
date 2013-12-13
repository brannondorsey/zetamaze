<!DOCTYPE html>
<html>
	<head>
		<?php require_once "includes/config.include.php";
			  require_once "includes/head.include.php";
	     ?>

		<link rel="stylesheet" type="text/css" href="styles/maze3d.css">
		<script src="scripts/three/three.js"></script>
		<script src="scripts/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="scripts/helpers.js"></script>
		<script src="scripts/three/classes/Maze3D.js"></script>
		<script src="scripts/three/classes/Block3D.js"></script>
		<script src="scripts/three/classes/Location3D.js"></script>
		<script src="scripts/three/Detector.js"></script>
		<script src="scripts/three/THREEx.KeyboardState.js"></script>
		<script src="scripts/three/THREEx.WindowResize.js"></script>
		<script src="scripts/three/MTLLoader.js"></script>
		<script src="scripts/three/OBJMTLLoader.js"></script>
		<script src="scripts/three/Stats.js"></script>
		<script src="scripts/three/classes/CharacterController.js"></script>
		
		<script>
			$(document).ready(function(){
				if(!Detector.webgl){
					$('div#instructions').html("Ooops, it looks like your browser doesn't support WebGL. Trying using Google Chrome.");
				}
			});
		</script>
	</head>

	<body>
		<div id="blocker">
			<div id="instructions">
	
				Click to play the maze that everyone has created for you.<br/>
				You can also <a href="make.php">edit</a> the maze for everyone else.<br/>
				(W, A, S, D = Move, MOUSE = Look around)

			</div>
		</div>

		<script>

			//globals
			var renderer, scene, camera, clock, character, stats, displayStats, maze3D;
			scene = new THREE.Scene();

			var blocker = document.getElementById( 'blocker' );
			var instructions = document.getElementById( 'instructions' );
			
			// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			document.addEventListener( 'click', function ( event ) {

				var havePointerLock = 'pointerLockElement' in document ||
								   'mozPointerLockElement' in document ||
								'webkitPointerLockElement' in document;
				
				if ( !havePointerLock ) return;

				if ( document.pointerLockElement === element || 
					 document.mozPointerLockElement === element || 
					 document.webkitPointerLockElement === element ) {

						blocker.style.display = 'none';

					} else {

						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';

						instructions.style.display = '';
					}
				
				var element = document.body;
				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock ||
										  element.mozRequestPointerLock ||
									   element.webkitRequestPointerLock;

				// Ask the browser to lock the pointer
				element.requestPointerLock();

				function pointerlockerror(){
					instructions.style.display = '';
				}
				
				// Hook pointer lock state change events
				document.addEventListener(      'pointerlockchange', pointerLockChange, false);
				document.addEventListener(   'mozpointerlockchange', pointerLockChange, false);
				document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.addEventListener( 'click', function ( event ) {

					instructions.style.display = 'none';

					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

					if ( /Firefox/i.test( navigator.userAgent ) ) {

						var fullscreenchange = function ( event ) {

							if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

								document.removeEventListener( 'fullscreenchange', fullscreenchange );
								document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

								element.requestPointerLock();
							}

						}

						document.addEventListener( 'fullscreenchange', fullscreenchange, false );
						document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

						element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

						element.requestFullscreen();

					} else {

						element.requestPointerLock();
					}

				}, false );


				
				
			}, false );

			$.ajax({
				url: <?php echo '"' . $HOSTNAME . "/api.php" . '"' ?> , //dont forget comma
				type: "get",
				dataType: "json",
				error: function(err){
					console.log(err);
				},
				success: function(response){
					var block3Dsize = 5;
					var mazeObj = response.data[0];
					maze3D = new Maze3D(scene, mazeObj, block3Dsize, "images/maze/textures/", "models/");

					//do it!
					init(maze3D);
					animate();
				}
			});
			
			function init(maze3D){

				renderer = new THREE.WebGLRenderer({antialias:true}); 
				camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 30);
				clock = new THREE.Clock();

				displayStats = true;

				//renderer
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);
			    
			    //camera
			    scene.add(camera);

			    //light
				var hemisphereLight = new THREE.HemisphereLight(0xffffff);
			    hemisphereLight.position.set(1, 1, 1).normalize();
			    scene.add(hemisphereLight);

			    //fog
			    scene.fog = new THREE.Fog( 0xffffff, 20, 30);
				
				//maze3D
				maze3D.addToScene();

				//character
				//character must be instantiated after maze3D is added to scene
				//var startPosition = new THREE.Vector3(4, 20, 5);
				var beginPosition = maze3D.getBeginPosition();
				character = new CharacterController(scene, camera, beginPosition);
				character.registerCollisionObjects(maze3D.getBlockMeshes(), maze3D.getBlockSize());

				//bind resize event
				THREEx.WindowResize(renderer, camera);

				//stants
				if(displayStats){

					stats = new Stats();
					stats.domElement.style.position = 'absolute';
					stats.domElement.style.bottom = '0px';
					stats.domElement.style.zIndex = 100;
					document.body.appendChild( stats.domElement );
				}

			}

			function animate() {

				var delta = clock.getDelta();
				requestAnimationFrame( animate );
				if(displayStats) stats.update();
				maze3D.update(delta);
				character.update(delta);
				renderer.render( scene, camera );

			}

			function pointerLockChange(event){

				var element = document.body;
				if (document.pointerLockElement       === element ||
				    document.mozPointerLockElement    === element ||
			        document.webkitPointerLockElement === element) {

					// Pointer was just locked, enable the mousemove listener
					document.addEventListener("mousemove", mouseMove, false);
				} 
				else {
					// Pointer was just unlocked, disable the mousemove listener
					document.removeEventListener("mousemove", mouseMove, false);
				}
			}

			function mouseMove(e){
				character.mouseMove(e);
			}

		</script>
	</body>
</html>