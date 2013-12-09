<!DOCTYPE html>
<html>
	<head>
		<?php require_once("includes/head.include.php"); ?>

		<link rel="stylesheet" type="text/css" href="styles/styles.css">
		<link rel="stylesheet" href="styles/farbtastic.css" />

		<script src="scripts/canvas/sketcher/smooth.js"></script>
		<script src="scripts/helpers.js"></script>
		<script src="scripts/jquery-1.10.2.min.js"></script>
		<script src="scripts/farbtastic.min.js"></script>

		<script src="scripts/canvas/sketcher/classes/SketchPad.js"></script>
		<script src="scripts/canvas/sketcher/classes/MarkerMaker.js"></script>
		<script src="scripts/canvas/sketcher/classes/WallDrawing.js"></script>
		<script src="scripts/canvas/sketcher/classes/WallSegment.js"></script>
		<script src="scripts/canvas/sketcher/sketcher.js">//this is the script that does stuff</script>
	</head>

	<body>
		<?php require_once('includes/navbar.include.php'); ?>
		<div class="content">
			<p>
			You can draw on the walls of the maze here. Each new drawing is sketched on top of the others. 
			Be careful, there is no eraser!
			<p>

			<img id="default-brush-image" style="visibility:hidden" src="images/sketcher/tip3.png">
			  
	       	<ul class="tools">
	          	<div class="drag_button">
	              	<img src="images/hand_icon.png">
	            </div>
	            <div id="color_swatch"></div>
	            <div id="colorpicker" style="position:absolute;"></div>
	        </ul>

			<canvas id="sketch" width="960" height="512"></canvas>

			<p style="text-align: center; padding-top: 20px">Finished your drawing? Now try and <a href="play.php">find</a> find it.</p>
			
		</div>
	</body>
</html>