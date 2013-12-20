<?php
	//acts as a backend maze validator to prevent unsolvable mazes
	//from being inserted into the database via a post request that doesn't
	//come from the canvas maze editor in the make.php page.
	//returns the html contents of this file + the string lfpsq66zf8 if maze
	//passes. This is a hacky way to do backend validation but it is in an
	//attempt to refrain from rewritting all of my javascript maze validation
	//in php.

	if(isset($_POST) &&
	   !empty($_POST)){

		$obj = new stdClass();
		foreach ($_POST as $key => $val) { 
		    $obj->$key = $val;
		}

		$mazeData = json_encode($obj); 

		?>
		<script type="text/javascript" src="scripts/helpers.js"></script>
		<script type="text/javascript" src="scripts/jquery-1.10.2.min.js" >//load jquery</script>
		<script type="text/javascript" src="scripts/canvas/kinetic-v4.7.0.min.js">//load kinetic</script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/MazeSolver.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Block.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Maze2D.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/Location.js"></script>
		<script type="text/javascript" src="scripts/canvas/maze/classes/ErrorHandler.js"></script>
		<script type="text/javascript">
			
			var mazeData = <?php echo $mazeData ?>; //don't forget semi
			var maze2D  = new Maze2D(JSON.parse(mazeData.maze), 800); //can pick random stage width (800) for this purpose
			maze2D.initLocations(mazeData);
			var errorHand = new ErrorHandler(); 
		    //errors
		    if(!errorHand.checkErrors(maze2D.data, maze2D.locations)){ 
		      document.write("lfpsq66zf8");
		    }
		</script>

<?php 
	} ?>




