<?php
	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	//setup and instantiate the api
	require_once 'includes/api_columns.include.php';
	require_once 'includes/api_setup.include.php';

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

?>

<!DOCTYPE html>
<html>
	<head>
		<?php require_once("includes/head.include.php"); ?>
		<link rel="stylesheet" type="text/css" href="styles/styles.css">
		<script src="scripts/helpers.js"></script>

		<script type="text/javascript" src="scripts/jquery-1.10.2.min.js" >//load jquery</script>
		<script type="text/javascript" src="scripts/canvas/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Maze.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Location.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/ErrorHandler.js"></script>
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

			<p style="text-align: center">Finished editing the structure of the maze? You should <a href="draw.php">draw</a> or <a href="play.php">play</a>!</p>
		</div>

	</body>
</html>
