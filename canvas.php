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
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="styles/base.css"g>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" ></script>
		<script type="text/javascript" src="scripts/canvas/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/canvas/helpers.js"></script>
		<script type="text/javascript" src="scripts/canvas/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/canvas/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/canvas/classes/Maze.js"></script>
		<script type="text/javascript" src="scripts/canvas/classes/Location.js"></script>
		<script type="text/javascript" src="scripts/canvas/classes/ErrorHandler.js"></script>
	</head>
	<body>
		<div class="maze-container">
			<div id="container" class="canvas"></div>
			<div class="error-box"></div>
		</div>
		<script type="text/javascript">
			var mazeData = <?php echo $mazeData; ?>
			
		</script>
		<script defer="defer" type="text/javascript" src="scripts/canvas/maze.js"></script>
		<form id="maze-form" method="post" action="" onsubmit="return saveMaze()">
			<?php 
			$input_columns = explode(", ", API::format_comma_delimited($columns));
			unset($input_columns[0]);
			unset($input_columns[1]);
			$i = 1;
			foreach ($input_columns as $column) {?>
				<input <?php if(strstr($column, "file") !== false){ echo "id='file" . ceil($i/4) . "'"; $i++; }?>name="<?php echo $column ?>" type="hidden" value="">
			<?php }?>
			<input type="submit" value="Submit">
		</form>
	</div>
	</body>
</html>