function Point(x, y){
    this.x = x;
    this.y = y;
}  

function MazeSolver(data, beginMazeX, beginMazeY, endMazeX, endMazeY){
    this.maze = data.slice(0); //make a copy not reference 
    this.mazeHeight = data.length;
    this.mazeWidth = data[0].length;
    this.startingPoint = new Point(beginMazeX, beginMazeY);
    this.endingPoint = new Point(endMazeX, endMazeY);

    this.wall = 1;
    this.free = 0;
    this.player = 2;
}

maze.prototype.isSolvable = function(){
    if(this.solve(this.startingPoint.x, this.startingPoint.y)) console.log("Maze solveable");
    else console.log("Maze unsolvable");
}
  
//prints the state of the maze solver to the console
Maze.prototype.print = function(){
    for (var y = 0; y < this.mazeHeight; y++){
        var row = "";
        for(var x = 0; x < this.mazeWidth; x++){
            row += this.maze[y][x].toString();
        }
        console.log(row);
    }
    console.log();
}

Maze.prototype.solve = function(x, y)
{
    // Make the move (if it's wrong, we will backtrack later.
    this.maze[y][x] = player;
    // If you want progressive update, uncomment these lines...
    
    //printMaze();
    
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
    if (x < this.mazeWidth && maze[y][x+1] == free && solve(x + 1, y))
    {
        return true;
    }
    if (y > 0 && maze[y-1][x] == free && solve(x, y - 1))
    {
        return true;
    }
    if (y < this.mazeHeight && maze[y + 1][x] == free && solve(x, y + 1))
    {
        return true;
    }

    // Otherwise we need to backtrack and find another solution.
    maze[y][x] = free;

    // If you want progressive update, uncomment these lines...
    //printMaze();
    //
    return false;
}