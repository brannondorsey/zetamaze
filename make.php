<?php
	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	//setup and instantiate the api
	require_once 'includes/api_columns.include.php';
	require_once 'includes/api_setup.include.php';

	//file validation
	require_once 'includes/filevalidation.include.php';

	//if POST...
	if(isset($_POST) &&
	   !empty($_POST)){

		$post_array = Database::clean($_POST);

		//validate here!
		if(!Database::execute_from_assoc($post_array, Database::$table)){
			echo "There was a problem inserting into the database";
		} 
	}

	$query_array = array("limit" => 1,
						 "pretty_print" => false);

	if($results = $api->get_json_from_assoc($query_array)){
		$json = json_decode($results);
		$mazeData = json_encode($json->data[0]);
	}else die("Database error");

	//if GET...
	if(isset($_GET) &&
	   !empty($_GET)){

	   	$file_upload_errors = array();

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

		if(!empty($file_upload_errors)) $file_upload_errors = json_encode($file_upload_errors);
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
		<script type="text/javascript" src="scripts/canvas/maze/classes/Maze.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Location.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/ErrorHandler.js"></script>
		<script>
			var fileInputVals = [];
			var allowedExtensions = <?php echo $allowed_exts_JSON ?> ;//don't forget semi
			var errors = [];

			var fileUploadSelector = '.file-upload input[type=file]';

			$(document).ready(function(){
				
				var i = 1;
				$(fileUploadSelector).each(function(){
					console.log($(this).val());
					$(this).change(function(){
						fileInputVals['file' + i] = $(this).val();
					});
					i++;
				});

				alertIfUploadFailed();
			});

			function validateFiles(){

				var i = 1;
				$(fileUploadSelector).each(function(){
					var filePath = $(this).val();
					console.log(filePath);
					if(filePath != '' &&
					   !allowedFileType(filePath)) errors.push('Item ' + i + ' is not an allowed file type');
					i++;
				});
				
				if(errors.length > 0){
					var errorString = (errors.length == 1) ? errors[0] : errors.join("\n");
					alert(errorString);
					errors = [];
					return false;
				}else return true;
			}

			//bool
			function allowedFileType(filePath){
				var periodIndex = filePath.lastIndexOf('.');
				var ext = filePath.substring(periodIndex + 1);
				var inArray = false;
				for(var i = 0; i < allowedExtensions.length; i++){
					if(ext == allowedExtensions[i]){
						inArray = true;
						break;
					}
				}
				return inArray;
			}

			function alertIfUploadFailed(){

				<?php if(isset($file_upload_errors) &&
					     !empty($file_upload_errors)){ ?>
					 var errors_from_get = <?php echo $file_upload_errors ?> ; //don't forget semi
				<?php } ?>

				if(errors_from_get != undefined){
					alert(errors_from_get.join("\n") + "\n\n" + "If you uploaded other files they were uploaded successfully");
				}
			}
			
		</script>
	</head>

	<body>
		<?php require_once('includes/navbar.include.php'); ?>
		<div class="content">

			<!--<h2>make</h2>-->
			<p>
			   You can edit the structure, start point, end point, and items that are hidden around the maze and on this page. 
			   Once you are finished editing, click the save button and the <a href="play.php">3D maze</a> will be updated to 
			   reflect your changes.
			<p>

			<div class="maze-key">
				<ul>
					<li style="color: #188000">Start</li>
					<li style="color: #fc1d00">End</li>
					<li style="color: #808080">Item</li>
				</ul>
			</div>

			<div class="maze-container">
				<div id="container" class="canvas"></div>
				<div class="error-box"></div>
			</div>

			<script type="text/javascript">
				var mazeData = <?php echo $mazeData; ?>	
			</script>
			<script defer="defer" type="text/javascript" src="scripts/canvas/maze/maze.js">//code for 2D editable maze</script>

			<form id="maze-form" method="post" action="" onsubmit="return saveMaze()">
				<?php 
				$input_columns = explode(", ", API::format_comma_delimited($columns));
				unset($input_columns[0]);
				unset($input_columns[1]);
				$i = 1;
				foreach ($input_columns as $column) {?>
					<input <?php if(strstr($column, "file") !== false){ echo "id='file" . ceil($i/4) . "'"; $i++; }?>name="<?php echo $column ?>" type="hidden" value="">
				<?php }?>
				<input type="submit" value="save" class="button">
			</form>

			<p>
				Each time a player in the maze picks up an item, a file is downloaded to their computer. You can choose 
				what those files are. You are free to change (or not change) as many files as you like. Most file types
				less than 5MB are allowed.
			</p>
	
			<form class="file-upload" action="fileupload.php" method="post" enctype="multipart/form-data" onsubmit="return validateFiles()">
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
