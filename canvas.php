<?php
	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	if(isset($_POST) &&
	   !empty($_POST)){

		//setup and instantiate the api
		require_once 'includes/api_setup.include.php';
		$post_array = Database::clean($_POST);
		
		//enter data into database and then use it to build the reloaded page...
	}

?>
<html>
	<head>
		<script type="text/javascript" src="scripts/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/classes/Maze.js"></script>
		<script type="text/javascript" src="scripts/classes/Location.js"></script>
	</head>
	<body>
		<div id="container"></div>
		<script type="text/javascript">
			var maze = <?php echo file_get_contents("mazedata/mazes/maze1.json")?>
		</script>
		<script defer="defer" type="text/javascript" src="scripts/maze.js"></script>
		<form method="post" action="" onsubmit="return maze.export()">
			<input id="maze" type="hidden" value="">
			<input id="begin" type="hidden" value="">
			<input id="end" type="hidden" value="">
			<input id="file1" type="hidden" value="">
			<input id="file2" type="hidden" value="">
			<input id="file3" type="hidden" value="">
			<input id="file4" type="hidden" value="">
			<input id="file5" type="hidden" value="">
			<input type="submit" value="Submit">
		</form>
	</div>
	</body>
</html>