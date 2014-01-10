<!DOCTYPE html>
<html>
	<head>
		<?php require_once 'includes/head.include.php'; ?>
		<link rel="stylesheet" type="text/css" href="styles/styles.css">
		<link rel="stylesheet" type="text/css" href="styles/info.css">
	</head>

	<body>
		<?php require_once 'includes/navbar.include.php'; ?>
		<div class="content">
			<h2>About</h2>
			<p>
				Zeta was created by <a href="http://twitter.com/brannondorsey">Brannon Dorsey</a>, a Chicago-based New Media artist 
				whose <a href="http://brannondorsey.com">interactive works</a> encourage collaboration and play. With it, he has created a space and a proposition, 
				what happens next is up to the Internet.
			</p>
			<br>
			<p>
				The goal of Zeta is to create a situation that encourages online communication and collaboration in a setting that presents older ideas in truly contemporary ways. These concepts are ones of anonymous 
				file sharing, mark making and virtual graffiti, and regarding the medium of video gaming itself; the value and process of item collection. 
				These ideas overshadow their accessible platform; the maze. Zeta is meant to be fun and playable by all, but to present meaning and depth to those who look for it.
			</p>

			<div class="frequently-asked-questions">
				<h2>FAQs</h2>
				<div class="question-divider">
					<p id="question">Why a maze?</p>
					<p class="answer">
						The idea came from reading "<a href="http://books.google.com/books?id=ILpgAAAAMAAJ">Mazes and Labyrinths</a>: A General Account of Their 
						History and Developments". The book traces mazes far into the way back, and describes their intricate designs and structures in ways that 
						show how each was relevant to the time that it was created. Zeta responds to the question of "what the absolute most contemporary maze would look like?" 
						It sets out to create a maze about as 2014-as-possible.
					</p>
				</div>
				<div class="question-divider">
					<p id="question">What is the Finder's Folder?</p>
					<p class="answer">
						The Finder's Folder is sort of the equivalent to the treasure at the end of the maze. Unlike other 
						aspects of the maze (which are editable by anyone) only those who find the folder while playing the game get to add 
						to it. This adds value to the accomplishment of completing the maze.
					</p>
				</div>
				<div class="question-divider">
					<p id="question">What kinds of files should I upload?</p>
					<p class="answer">
						Anything you would like to share! Any art, music, or writing that you made is perfect. Don't make things? 
						Share something that interests you. 
					</p>
				</div>
				<div class="question-divider">
					<p id="question">Do my changes affect the maze in real time?</p>
					<p class="answer">
						Not exactly. Anything you do on the <a href="make.php">make</a> or <a href="draw.php">draw</a> pages won't
						show up in any mazes that have already been loaded (i.e. the people playing the game now). But any mazes that are loaded 
						between now, and when someone else edits your edits will be exactly how you saved them. As for drawings, there is no eraser,
						so yours should be there for a while.
					</p>
				</div>
				<div class="question-divider">
					<p id="question">Drawing feels weird, any tricks to make it easier?</p>
					<p class="answer">Use a mouse, three-finger drag on a trackpad, or better yet, a tablet.</p>
				</div>
				<div class="question-divider">
					<p id="question">What is the "all walls must be connected error" on the <a href="make.php">make</a> page?</p>
					<p class="answer">
						This means that you have an "island" (a section of walls that are isolated from the rest of the walls) 
						somewhere in the maze. In order to not make the maze too difficult, every wall
						must be connected adjacent or diagonally to the rest of the walls in the maze.
					</p>
				</div>
				<div class="question-divider">
					<p id="question">Game lags, especially when I pick up an item? Is this normal?</p>
					<p class="answer">
						3D rendering in a browser can sometimes be a little rough, especially when your browser is
						also trying to download files. Sometimes it takes a minute or two for the game to quit feeling jerky. 
						Also try using the arrow controls instead of the mouse. If it persists try closing some applications on
						your computer.
					</p>
				</div>
				<div class="question-divider">
					<p id="question">Open Source?</p>
					<p class="answer">Yep! Zeta is published (c) 2014 Brannon Dorsey under the 
						<a href="license.txt">MIT License</a>. Code on 
						<a href="http://github.com/brannondorsey/zetamaze">GitHub</a>.
					</p>
				</div>
			</div>
			<p>
				Because Zeta is an online game and its content (including all imagery and digital files) are controlled
				by the public, Brannon Dorsey accepts no responsibility for the unwanted (1) experiences, (2) files/downloads, or (3) interactions 
				on or as a result of this website. By using this website you agree to being in full compliance and understanding
				with the above statement as well as this <a href="disclaimer.pdf">disclaimer</a>.
			</p>
			<br>
			<p style="text-align:center">
				Zeta is proudly supported by <a href="http://olab.io">olab.io</a>
			</p>
		</div>
	</body>
</html>
