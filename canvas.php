<?php
	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	require_once 'includes/api_columns.include.php';

	if(isset($_POST) &&
	   !empty($_POST)){

		//setup and instantiate the api
		require_once 'includes/api_setup.include.php';
		$post_array = Database::clean($_POST);
		var_dump($post_array);
		
		//enter data into database and then use it to build the reloaded page...
	}

?>
<html>
	<head>
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" ></script>
		<script type="text/javascript" src="scripts/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/classes/Maze.js"></script>
		<script type="text/javascript" src="scripts/classes/Location.js"></script>
	</head>
	<body>
		<div id="container"></div>
		<script type="text/javascript">
			var mazeData = <?php echo file_get_contents("mazedata/mazes/maze1.json") . ";"?>
		</script>
		<script defer="defer" type="text/javascript" src="scripts/maze.js"></script>
		<form id="maze-form" method="post" action="" onsubmit="return exportMaze()">
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