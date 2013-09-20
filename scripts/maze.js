var stage = new Kinetic.Stage({
	container: 'container',
	width: 800,
	height: 500
});
var layer = new Kinetic.Layer();

var mazeWidth = 9;
var mazeHeight = 9;
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

var blocks = displayMaze(maze, 25);
console.log(blocks);
for(var y = 0; y < blocks.length; y++){
	for(var x = 0; x < blocks[0].length; x++){
		var block = blocks[y][x];
		if(block.state) layer.add(block.rect);
	}
}
// add the shape to the layer
//layer.add(block.rect);
// add the layer to the stage
stage.add(layer);

//----------------------------------------------------

//returns a 2D array of Blocks
function displayMaze(maze, blockSize){
	var mazeWidth = maze[0].length;
	var mazeHeight = maze.length;
	var xPos = 0;
	var yPos = 0;

	var blocks = [];
	for(var y = 0; y < mazeHeight; y++){
		blocks[y] = [];
		for(var x = 0; x < mazeWidth; x++){
			var index = x.toString()+","+y.toString();
			var state = (maze[y][x] == 1) ? true: false;
			blocks[y][x] = new Block(index, state, xPos, yPos, blockSize, blockSize);
			xPos += blockSize;
		}
		xPos = 0;
		yPos += blockSize;
	}
	console.log(blocks[0][0]);
	return blocks;
}

//----------------------------------------------------

function Block(index, state, x, y, w, z){
	this.index = index;
	this.state = state;
	if(this.state){
		this.rect  = new Kinetic.Rect({
			x: x,
			y: y,
			width: w,
			height: z,
			fill: 'black',
		});
	}
}