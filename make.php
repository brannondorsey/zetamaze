<?php
	
	require_once 'includes/config.include.php';
	require_once 'includes/helpers.include.php';

	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	//setup and instantiate the api
	require_once 'includes/api_columns.include.php';
	require_once 'includes/api_setup.include.php';

	//file validation include
	require_once 'includes/filevalidation.include.php';

	//if POST...
	if(isset($_POST) &&
	   !empty($_POST)){

		$post_array = Database::clean($_POST);

		if(isset($post_array['maze']) &&
		   !empty($post_array['maze'])){

			//server-side validation below
			//technique taken from here:
			//http://stackoverflow.com/questions/2445276/how-to-post-data-in-php-using-file-get-contents
			
			$url = $HOSTNAME . "/mazevalidator.php";
			$postdata = http_build_query($post_array);
			$opts = array('http' =>
			    array(
			        'method'  => 'POST',
			        'header'  => 'Content-type: application/x-www-form-urlencoded',
			        'content' => $postdata
			    )
			);
			$context  = stream_context_create($opts);
			$response = file_get_contents($url, false, $context);

			//lfpsq66zf8 is a success code sent from mazevalidator.php
			//the below conditional means that mazevalidator.php passed
			//the maze
			if(strpos($response, "lfpsq66zf8") !== false){
				if(!Database::execute_from_assoc($post_array, Database::$table)){
					echo "There was a problem inserting into the database";
				} 
			}
		}
	}

	$query_array = array("limit" => 1,
						 "pretty_print" => false);

	if($results = $api->get_json_from_assoc($query_array)){
		$json = json_decode($results);
		$mazeData = json_encode($json->data[0]);
	}else die("Database error");

	//vars that hold upload messages from GET
	$maze_upload_success = false;
	$file_upload_success = false;
	$file_upload_errors = array();
	
	//if GET...
	if(isset($_GET) &&
	   !empty($_GET)){

		//if maze upload was a success
		if (isset($_GET['maze_upload_success']) &&
			      $_GET['maze_upload_success'] == "true"){
			$maze_upload_success = true;
		}
		//if file upload was a success
		else if(isset($_GET['file_upload_success']) &&
				$_GET['file_upload_success'] == "true"){
			$file_upload_success = true;
		}
		//if no files were sent but "upload" was pressed
		else if(isset($_GET['no_files']) &&
				$_GET['no_files'] == "true"){
			$file_upload_errors[] = "No files selected";
		}
		//if file upload was a failure
		else{
		
			for($i = 0; $i < $numb_files; $i++){

				$filename = "file" . ($i + 1);

				if(isset($_GET[$filename]) &&
				   !empty($_GET[$filename])){

					if($_GET[$filename] == 'size_error'){
						$file_upload_errors[] = "Item " . ($i + 1) . " was too large";
					}else if($_GET[$filename] == 'type_error'){
						$file_upload_errors[] = "Item " . ($i + 1) . " is not a supported file type";
					}
				}
			}
		}
	}

?>

<!DOCTYPE html>
<html>
	<head>
		<?php require_once 'includes/head.include.php'; ?>
		<link rel="stylesheet" type="text/css" href="styles/styles.css">
		<script src="scripts/helpers.js"></script>

		<script type="text/javascript" src="scripts/jquery-1.10.2.min.js" >//load jquery</script>
		<script type="text/javascript" src="scripts/canvas/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Maze2D.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Location.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/ErrorHandler.js"></script>
		<script type="text/javascript">

			var fileInputVals = [];
			var allowedExtensions = <?php echo $allowed_exts_JSON ?> ; //don't forget semi
			var maxFileSize = <?php echo $max_size ?> ; //don't forget semi
			var errors = [];
			var fileUploadSelector = '.file-upload input[type=file]';
			var fileUploadNotificationSelector = '#file-upload-notification';

			var fileUploadSuccess = <?php echo json_encode($file_upload_success) ?>; //don't forget semi
			var mazeUploadSuccess = <?php echo json_encode($maze_upload_success) ?>;

			<?php if(!empty($file_upload_errors)){ ?>
				 var errorsFromGet = <?php echo json_encode($file_upload_errors) ?> ; //don't forget semi
			<?php } ?>

		</script>
		<script type="text/javascript" src="scripts/fileupload.js">//front end file upload code</script>
		<script type="text/javascript">

			$(document).ready(function(){

				//fade in instructions
				setTimeout(function(){
					$(".instructions").addClass('instructions-show');
				}, 200);
				

				//if a maze was saved successfully
				if(mazeUploadSuccess){
					$(".instructions").html("Maze updated, go <a href=\"play.php\">play</a>!");
					$(".instructions").addClass('success-text');
				}

				// //hover event hanlder for 2D maze error box
				// $('.error-box').mouseenter(function(){
				// 	$(this).hide();
				// 	var self = this;
				// 	setTimeout(function(){$(self).show()}, 300);
				// });

			});
		</script>
	</head>

	<body>
		<?php require_once('includes/navbar.include.php'); ?>
		<div class="content">
			<div id="maze-upload-notification"></div>
			<p class="instructions" style="text-align:center">
			   Click to edit walls &amp; drag to move icons. <br/> 
			   Press save below to update the <a href="play.php">3D maze</a>.
			<p>

			<div class="maze-key">
				<div>
					<img src="images/builder/begin.png"/>
					<span>start</span>
				</div>
				<div>
					<img src="images/builder/file.png"/>
					<span>item</span>
				</div>
				<div>
					<img src="images/builder/zip.png"/>
					<span>end</span>
				</div>
			</div>

			<div class="maze-container">
				<div id="container" class="canvas"></div>
				<div class="error-box"></div>
			</div>

			<script type="text/javascript">
				var mazeData = <?php echo $mazeData; ?>	
			</script>
			<script defer="defer" type="text/javascript" src="scripts/canvas/maze/canvas-maze.js">//code for 2D editable maze</script>

			<form id="maze-form" method="post" action="make.php?maze_upload_success=true" onsubmit="return saveMaze();">
				<?php 
				$input_columns = explode(", ", API::format_comma_delimited($columns));
				unset($input_columns[0]);
				unset($input_columns[1]);
				$i = 1;
				foreach ($input_columns as $column) {?>
					<input <?php if(strstr($column, "file") !== false){ echo "id='file" . ceil($i/4) . "'"; $i++; }?>name="<?php echo $column ?>" type="hidden" value="">
				<?php }?>
				<input id="save" type="submit" value="save" class="button">
			</form>

			<p>
				Each time a player in the maze picks up an item, a file is downloaded to their computer. You can choose 
				what those files are. You are free to change (or not change) as many files as you like. Most file types
				less than 5MB are allowed.
			</p>
	
			<div id="file-upload-notification" class="file-upload-notification"><!--note: class and id duplicates are not a mistake--></div>
			<form class="file-upload" action="fileupload.php" method="post" enctype="multipart/form-data" onsubmit="return onFilesSubmit()">
				<?php for($i = 0; $i < 4; $i++){ 
					$name = "file" . ($i + 1); ?>
				<div class="file-upload-input-container">
					<label for="<?php echo $name?>">Item <?php echo $i + 1; ?>:</label>
					<input type="file" name="<?php echo $name?>" id="<?php echo $name ?>">
				</div>
				<?php } ?>
				<input type="submit" name="submit" value="upload" class="button">
			</form>

			<p style="text-align: center">Finished editing the structure of the maze? You should <a href="draw.php">draw</a> or <a href="play.php">play</a>!</p>
		</div>

	</body>
</html>
