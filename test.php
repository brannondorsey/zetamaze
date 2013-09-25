<html>
	<head>
		<script language="javascript" type="text/javascript" src="scripts/classes/MazeSolver.js"></script>
		<script type="text/javascript">
			var maze =
			   [[1,0,1,1,1,1,1,1,1],
			    [1,0,0,0,1,0,0,0,0],
			    [1,0,1,1,1,0,1,1,1],
			    [1,0,1,0,0,0,1,0,1],
			    [1,0,1,0,0,0,1,0,1],
			    [1,0,0,0,1,0,1,0,1],
			    [1,0,1,1,1,0,1,0,1],
			    [1,0,0,0,1,0,0,0,1],
			    [1,1,1,1,1,1,1,0,1]];

			function tester(){
				var solver = new MazeSolver(maze, 1, 1, 7, 8);
				solver.print();
			    if(solver.isSolvable()){
			    	console.log("Maze solveable");
			    } 
			    else console.log("Maze unsolvable");		
			}

			document.addEventListener("click", tester);
        </script>
	</head>
	<body>
	</body>
</html>