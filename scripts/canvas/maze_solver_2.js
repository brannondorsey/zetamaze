var mazeHeight = 9;
var mazeWidth = 9;

var wall = 1;
var free = 0;
var player = 2;

function Point(x, y){
    this.x = x;
    this.y = y;
}
    
//prints the state of the maze solver to the console
function printMaze()
{
    for (var y = 0; y < mazeHeight; y++)
    {
        var row = "";
        for(var x = 0; x < mazeWidth; x++){
            row += maze[y][x].toString();
        }
        console.log(row);
    }
    console.log();
}

function solve(x, y)
{
    // Make the move (if it's wrong, we will backtrack later.
    maze[y][x] = player;
    // If you want progressive update, uncomment these lines...
    
    //printMaze();
    
    // Check if we have reached our goal.
    if (x == endingPoint.x && y == endingPoint.y)
    {
        return true;
    }

    // Recursively search for our goal.
    if (x > 0 && maze[y][x-1] == free && solve(x - 1, y))
    {
        return true;
    }
    if (x < mazeWidth && maze[y][x+1] == free && solve(x + 1, y))
    {
        return true;
    }
    if (y > 0 && maze[y-1][x] == free && solve(x, y - 1))
    {
        return true;
    }
    if (y < mazeHeight && maze[y + 1][x] == free && solve(x, y + 1))
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