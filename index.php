<!DOCTYPE html>
<html>
	<head>
		<?php require_once "includes/config.include.php"; ?>
		<?php require_once "includes/head.include.php"; ?>
		<link rel="stylesheet" type="text/css" href="styles/index.css">
	</head>

	<body>
		<div id="links">
			<a href="make.php" id="make">make</a> /
			<a href="draw.php" id="draw">draw</a> /
			<a href="play.php" id="play">play</a>
		</div>
		<div id="description">

			<p>
			Zeta is a collaborative 3D maze game. You can <a href="make.php">edit</a>, 
			<a href="draw.php">draw on</a>, and <a href="play.php">explore</a> the maze. 
			Any changes you make will affect the next player's experience. That is, until
			someone else overwrites them.
			</p>

			<p style="text-align: center"><a href="http://twitter.com/brannondorsey">@brannondorsey</a></p>
		</div>
	</body>
</html>