var stage = new Kinetic.Stage({
	container: 'container',
	width: 800,
	height: 800
});
var layer = new Kinetic.Layer();

var maze  = new Maze(mazeData, stage.getWidth(), stage.getHeight());

maze.draw(layer);
bindEvents();

// add the layer to the stage
stage.add(layer);
exportMaze() //COME BACK

function bindEvents(){
    //bind events for each block...
    for(var y = 1; y < maze.blocks.length-1; y++){
        for(var x = 1; x < maze.blocks[0].length-1; x++){

            //on click
            maze.blocks[y][x].rect.on('click', function(){
                maze.toggleBlock(this.index, layer);
            });

            //on mouseover
            maze.blocks[y][x].rect.on('mouseover', function(){
                document.body.style.cursor = 'pointer';
            });

            //on mouseout
            maze.blocks[y][x].rect.on('mouseout', function(){
                document.body.style.cursor = 'default';
            });
            
        }
    }

    //bind events for locations
    for(var key in maze.locations){
        var locationRect = maze.locations[key].rect;

        locationRect.on('dragend', function(){ maze.recalculateLocation(this.index); exportMaze()});
        locationRect.on('mouseover', function(){ document.body.style.cursor = 'move'; });
        locationRect.on('mouseout', function(){ document.body.style.cursor = 'default'; });
    }
}

function mapRange(value, low1, high1, low2, high2){
    return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

function exportMaze(){
    var result = maze.export();
    console.log(result ? "maze passes" : "maze fails");
    return result;
}
