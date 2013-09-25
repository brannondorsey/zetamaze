function Point(x, y){
    this.x = x;
    this.y = y;
}  

function MazeSolver(data, beginMazeX, beginMazeY, endMazeX, endMazeY){
    this.maze = this.getCopy(data); //data.slice(0); //make a copy not reference
    this.mazeHeight = this.maze.length;
    this.mazeWidth = this.maze[0].length;
    this.startingPoint = new Point(beginMazeX, beginMazeY);
    this.endingPoint = new Point(endMazeX, endMazeY);

    this.wall = 1;
    this.free = 0;
    this.player = 2;
}

MazeSolver.prototype.isSolvable = function(){
    // console.log("Begin mazeX: " + this.startingPoint.x);
    // console.log("Begin mazeY: " + this.startingPoint.y);
    // console.log("End mazeX: " + this.endingPoint.x);
    // console.log("End mazeY: " + this.endingPoint.y);
    // console.log("Maze width: " + this.mazeWidth);
    // console.log("End Height: " + this.mazeHeight);
    var startX = this.startingPoint.x;
    var startY = this.startingPoint.y;
    if(this.solve(startX, startY)) return true;
    else{
        return false;
    } 
}
  
//prints the state of the maze solver to the console
MazeSolver.prototype.print = function(){
    for (var y = 0; y < this.mazeHeight; y++){
        var row = "";
        for(var x = 0; x < this.mazeWidth; x++){
            row += this.maze[y][x].toString();
        }
        console.log(row);
    }
    console.log();
}

MazeSolver.prototype.solve = function(x, y)
{
    // Make the move (if it's wrong, we will backtrack later.
    this.maze[y][x] = this.player;
    // If you want progressive update, uncomment these lines...
    
    // Check if we have reached our goal.
    if (x == this.endingPoint.x && y == this.endingPoint.y)
    {
        return true;
    }

    // Recursively search for our goal.
    if (x > 0 && this.maze[y][x-1] == this.free && this.solve(x - 1, y))
    {
        return true;
    }
    if (x < this.mazeWidth && this.maze[y][x+1] == this.free && this.solve(x + 1, y))
    {
        return true;
    }
    if (y > 0 && this.maze[y-1][x] == this.free && this.solve(x, y - 1))
    {
        return true;
    }
    if (y < this.mazeHeight && this.maze[y + 1][x] == this.free && this.solve(x, y + 1))
    {
        return true;
    }

    // Otherwise we need to backtrack and find another solution.
    this.maze[y][x] = this.free;

    // If you want progressive update, uncomment these lines...
    //this.print();
    //console.log(x+", "+y+" didnt work");
    //
    return false;
}


//because 2D arrays are passed by reference this function copies the maze
MazeSolver.prototype.getCopy = function(maze){
    var arrayToReturn = [];
    for(var i = 0; i < maze.length; i++){
        arrayToReturn[i] = maze[i].slice();
    }
    return arrayToReturn;
}