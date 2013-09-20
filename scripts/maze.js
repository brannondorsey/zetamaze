var stage = new Kinetic.Stage({
	container: 'container',
	width: 800,
	height: 800
});
var layer = new Kinetic.Layer();

var maze =
   [[1,0,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1]];

var begin = new Location(1, 0);
var end   = new Location(7, 8);
var maze  = new Maze(maze, 40, begin, end);

maze.draw(layer);
bindEvents();

// add the layer to the stage
stage.add(layer);

function bindEvents(){
    for(var y = 1; y < maze.blocks.length-1; y++){
        for(var x = 1; x < maze.blocks[0].length-1; x++){
            maze.blocks[y][x].rect.on('click', function(){
                maze.toggleBlock(this.index, layer);
            });
        }
    }
}
