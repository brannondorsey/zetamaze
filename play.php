<?php
	require_once "includes/filevalidation.include.php";
?>

<!DOCTYPE html>
<html>
	<head>
		<?php require_once "includes/config.include.php";
			  require_once "includes/head.include.php";
	     ?>
	    <link rel="stylesheet" type="text/css" href="styles/styles.css">
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
		<script type="text/javascript">

			var fileInputVals = [];
			var allowedExtensions = <?php echo $allowed_exts_JSON ?> ; //don't forget semi
			var maxFileSize = <?php echo $max_size ?> ; //don't forget semi
			var errors = [];
			var fileUploadSelector = '.file-upload-input-container input[type=file]';
			var fileUploadNotificationSelector = '#file-upload-notification';
			var endContainerSelector = '#end-container';
			var fileUploadSuccess = false;
			var responsePending = false;

		</script>
		<script type="text/javascript" src="scripts/fileupload.js"></script>
		<script>

			var hostname = <?php echo "'" . $HOSTNAME . "'"?>;
			$(document).ready(function(){

				if(!Detector.webgl){
					instructions.html("Oops, it looks like your browser doesn't support WebGL. Trying using Google Chrome.");
				}

				//postion instructions box in center of screen
				centerBoxes();

				//register resize event
				window.onresize = function(event){
					centerBoxes();
				}

				//register "No thanks" button click event
				$('#end-container button#no-submit').click(function(){
					hideEndContainer(0);
				});

				//register file upload button click event
				$('#end-container button#submit').click(function() {

                    
	                if(onFilesSubmit()){

	                	var data = new FormData();
	                    data.append('end',$(".file-upload-input-container [type='file']").get(0).files[0]);

	                    if(!responsePending){
	           
	                    	$(fileUploadNotificationSelector).html("Uploading...");
	                    	$(fileUploadNotificationSelector).addClass('normal-text');

	                    	$.ajax({
		                        url:'fileupload.php?redirect=false',
		                        type:'POST',
		                        processData: false,
		                        contentType: false,
		                        data:data,
		                        success:function(response){
		                            responsePending = false;
		                            //resultsArray will contain responses from fileupload.php
		                            //as properties and values in an object. I tried making them
		                            //an assoc array but that didn't work. For this reason, instead
		                            //of handling lots of conditionals to report backend file upload
		                            //errors all errors are handled frontend.
		                            console.log(response);
		                            console.log("success");
		                            for(var property in response){
		                            	
		                            	//if the upload was a success!
		                            	if(property == "file_upload_success" &&
		                            	   response[property] == "true"){
		                            		displayFileUploadSuccess();
		                            	}

		                            	//if no file was uploaded
		                            	if(property == "no_files" &&
		                            	   response[property] == "true"){
		                            		$(fileUploadNotificationSelector).html("Please choose a file");
											$(fileUploadNotificationSelector).addClass('error-text');
		                            	}
		                            }    
		                        },
		                        error: function(err){
		                        	responsePending = false;
		                        }
		                    });
							responsePending = true;
	                    }
		            }
	            });
            
            });

		</script>
	</head>

	<body>
		<?php require_once 'includes/navbar.include.php'; ?>
		<div id="instructions" class="centered-box">
			<img src="images/maze/move_instructions.png" alt="Move using the W, A, S, and D keys"/>
			<img src="images/maze/look_instructions.png" alt="Look using the mouse or the arrow keys"/>
			<button type="button" onclick="hideInstructions()">got it!</button>
		</div>
		<div id="end-container" class="centered-box">
			<p>
				You found the Finder's Folder! <span>A <code>.zip</code> containing <?php echo $FINDERS_FOLDER_SIZE ?> files has been downloaded to your computer.</span>
			 	Each of these files was uploaded by someone else who found the Finder's Folder. Now its your turn to upload.
			</p>

		<div id="file-upload-notification" class="file-upload-notification"><!--note: class and id duplicates are not a mistake--></div>
			<form class="zip-file-upload" action="" method="post" enctype="multipart/form-data">
				<div class="file-upload-input-container">
					<label for="end-file">File</label>
					<input type="file" name="end" id="end-file">
				</div>
			</form>
			<button id="submit">Upload</button>
			<button id="no-submit">No thanks</button>
		</div>
		<div id="blocker">
			<p style="color: #ffffff">
				Zetamaze downloads files to your computer when you pick up items. <br>
				To opt-out of this feature
				<span id="opt-out" onclick="optOutFileDownload()">click here</span>.
			</p>
			<progress class="centered-box" value="0" max="100"></progress>
		</div>

		<script>

			//globals
			var element = document.body; //used for pointer lock
			var renderer, scene, camera, clock, character, stats, displayStats, maze3D;
			scene = new THREE.Scene();

			var progress = $('progress');
			var instructions = $("#instructions");

			var isLoaded = false;
			var isPointerLocked = false;
			
			// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			$.ajax({
				url: hostname + "/api.php",
				type: "get",
				dataType: "json",
				error: function(err){
					console.log(err);
				},
				success: function(response){
					var block3Dsize = 5;
					var mazeObj = response.data[0];
					maze3D = new Maze3D(hostname, scene, mazeObj, block3Dsize, "images/maze/textures_small/", "models/");

					//do it!
					init(maze3D);
					animate();
				}
			});
			
			function init(maze3D){

				renderer = new THREE.WebGLRenderer({ antialias: true }); 
				camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 26);
				clock = new THREE.Clock();

				displayStats = true;

				//renderer
				var heightSubtractor = $('#navbar').height();
				renderer.setSize(window.innerWidth, window.innerHeight - heightSubtractor);
				var domElement = renderer.domElement;
				domElement.onclick = lockPointer;
				document.body.appendChild(domElement);
			    
			    //camera
			    scene.add(camera);

			    //light
				var hemisphereLight = new THREE.HemisphereLight(0xffffff);
			    hemisphereLight.position.set(1, 1, 1).normalize();
			    scene.add(hemisphereLight);

			    //fog
			    scene.fog = new THREE.Fog( 0xffffff, 16, 26);
				
				//maze3D
				maze3D.addToScene();

				//character
				//character must be instantiated after maze3D is added to scene
				//var startPosition = new THREE.Vector3(4, 20, 5);
				var beginPosition = maze3D.getBeginPosition();
				character = new CharacterController(scene, camera, beginPosition);
				character.setEnabled(false);
				character.registerCollisionObjects(maze3D.getBlockMeshes(), maze3D.getBlockSize());

				//bind resize event
				THREEx.WindowResize(renderer, camera, heightSubtractor);

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

				if(!isLoaded){
				   progress.val(maze3D.getPercentLoaded());
				   isLoaded = maze3D.isLoaded();
				   //just loaded!
				   if(isLoaded){
				   		$('#blocker').remove();
						showInstructions();
				   		startGame();
				   }
				}

				maze3D.update(delta);
				character.update(delta);
				// console.log("x: " + character.getX());
				// console.log("z: " + character.getZ());
				renderer.render( scene, camera );
			}

			//called once loading bar finishes
			function startGame(){
				character.setEnabled(true);
			}

			function optOutFileDownload(){
				maze3D.setDownloadsEnabled(false);
				$('#blocker p').css({ color: $('#blocker').css('color')});
				$('#end-container span').css({textDecoration: 'line-through'});
			}

			function centerBoxes(){

				$('.centered-box').each(function(){
					$(this).css({
						top: window.innerHeight / 2 - $(this).height() / 2,
						left: window.innerWidth / 2 - $(this).width() / 2,
					});
				});

				//position progress bar in center of screen
				$('#blocker p').css({ marginTop: window.innerHeight - $(this).height() / 2 - 100});
			}

			function showInstructions(){
				instructions.show();
			}

			function hideInstructions(){
				instructions.hide();
			}

			function hideEndContainer(delay){
				setTimeout(function(){
					$(endContainerSelector).fadeOut(500, function(){
						$(endContainerSelector).css({display: "none"});
					});
				}, delay);
			}

			function displayFileUploadSuccess(){
				
				$(endContainerSelector).html('Upload Successful!');
				$(endContainerSelector).addClass('success-text');
				centerBoxes();
				hideEndContainer(1500);
			}

			function onEndReached(){

				var havePointerLock = 'pointerLockElement' in document ||
								   'mozPointerLockElement' in document ||
								'webkitPointerLockElement' in document;
				
				if (havePointerLock){
					// Ask the browser to release the pointer
					document.exitPointerLock = document.exitPointerLock ||
											   document.mozExitPointerLock ||
											   document.webkitExitPointerLock;

					// Ask the browser to release the pointer
					document.exitPointerLock();
				}
				
				$(endContainerSelector).css({display: "block"});
			}

			function lockPointer() {

				var havePointerLock = 'pointerLockElement' in document ||
								   'mozPointerLockElement' in document ||
								'webkitPointerLockElement' in document;
				
				if ( !havePointerLock ) return;
				
				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock ||
										  element.mozRequestPointerLock ||
									   element.webkitRequestPointerLock;

				// Ask the browser to lock the pointer
				element.requestPointerLock();

				function pointerlockerror(){
					console.log('pointer lock error');
					// instructions.style.display = '';
				}
				
				// Hook pointer lock state change events
				document.addEventListener(      'pointerlockchange', pointerLockChange, false);
				document.addEventListener(   'mozpointerlockchange', pointerLockChange, false);
				document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				function pointerLockChange(event){

					
					if (document.pointerLockElement       === element ||
					    document.mozPointerLockElement    === element ||
				        document.webkitPointerLockElement === element) {

						// Pointer was just locked, enable the mousemove listener
						document.addEventListener("mousemove", mouseMove, false);
						isPointerLocked = true;
					} 
					else {
						// Pointer was just unlocked, disable the mousemove listener
						document.removeEventListener("mousemove", mouseMove, false);
						isPointerLocked = false;
					}

					var opacity = (isPointerLocked) ? 1 : 0;
					$('.navbar-insert span').css({opacity: opacity});
				}
			}

			function mouseMove(e){
				character.mouseMove(e);
			}

		</script>
	</body>
</html>