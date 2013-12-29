<!DOCTYPE html>
<html>
	<head>
		<?php 
		require_once 'includes/config.include.php';
		require_once 'includes/head.include.php'; 
		?>

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
		<script>var hostname = <?php echo '"' . $HOSTNAME . '"'?>;</script>
		<script src="scripts/canvas/sketcher/sketcher.js">//this is the script that does stuff</script>
		<script type="text/javascript">
			$(document).ready(function(){
				//fade in instructions
				setTimeout(function(){
					$(".instructions").addClass('instructions-show');
				}, 200);
			});
		</script>
	</head>

	<body>
		<?php require_once 'includes/navbar.include.php'; ?>
		<div class="content">
			<p class="instructions" style="text-align:center">
			Draw on the walls of the maze. Be careful, there is no eraser!
			<p>

			<img id="default-brush-image" style="visibility:hidden" src="images/sketcher/tip3.png">
			  
	       	<ul class="tools">
	          	<div id="tool_button" title="tools" class="draw_button"></div>
	            <div id="color_swatch" title="color picker"></div>
	            <div id="colorpicker" style="position:absolute;"></div>
	        </ul>

			<canvas id="sketch" class="drawing" width="960" height="512"></canvas>

			<p style="text-align: center; padding-top: 20px">Finished drawing? Try and <a href="play.php">find</a> it.</p>
			
		</div>
	</body>
</html>