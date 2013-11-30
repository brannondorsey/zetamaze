//create replaceAt function
String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

var mazeHeight = 9;
var mazeWidth = 9;

var maze =
[
    "# #######",
    "#   #   #",
    "# ### # #",
    "# #   # #",
    "# #   # #",
    "#   # # #",
    "# ###   #",
    "#   #   #",
    "####### #",
];

var wall = '#';
var free = ' ';
var player = '*';

function Point(x, y){
    this.x = x;
    this.y = y;
}
    
//prints the state of the maze solver to the console
function printMaze()
{
    for (var y = 0; y < mazeHeight; y++)
    {
        console.log(maze[y]);
    }
    console.log();
}

function solve(x, y)
{
    // Make the move (if it's wrong, we will backtrack later.
    maze[y] = maze[y].replaceAt(x, player);
    // If you want progressive update, uncomment these lines...
    
    //printMaze();
    //Sleep(50);

    // Check if we have reached our goal.
    if (x == endingPoint.x && y == endingPoint.y)
    {
        return true;
    }

    // Recursively search for our goal.
    if (x > 0 && String(maze[y]).charAt(x - 1) == free && solve(x - 1, y))
    {
        return true;
    }
    if (x < mazeWidth && maze[y].charAt(x + 1) == free && solve(x + 1, y))
    {
        return true;
    }
    if (y > 0 && maze[y - 1].charAt(x) == free && solve(x, y - 1))
    {
        return true;
    }
    if (y < mazeHeight && maze[y + 1].charAt(x) == free && solve(x, y + 1))
    {
        return true;
    }

    // Otherwise we need to backtrack and find another solution.
    maze[y] = maze[y].replaceAt(x, free);

    // If you want progressive update, uncomment these lines...
    //printMaze();
    //Sleep(50);
    return false;
}