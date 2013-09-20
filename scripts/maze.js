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

var maze = new Maze(maze, 40);
maze.draw(layer);

// add the layer to the stage
stage.add(layer);

maze.blocks[0][0].rect.on('click', function(){
	this.setFill('white');
});