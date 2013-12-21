var stage = new Kinetic.Stage({
	container: 'container',
	width: 800,
	height: 800
});
var layer = new Kinetic.Layer();

//-----------------------------------------------------------------------

var maze2D  = new Maze2D(JSON.parse(mazeData.maze), stage.getWidth());
maze2D.initLocations(mazeData, function(){
    maze2D.display(layer);
    bindEvents();
    stage.add(layer);
});

//-----------------------------------------------------------------------

function bindEvents(){
    //bind events for each block...
    for(var y = 1; y < maze2D.blocks.length-1; y++){
        for(var x = 1; x < maze2D.blocks[0].length-1; x++){

            //on click
            maze2D.blocks[y][x].rect.on('click', function(){
                maze2D.toggleBlock(this.index, layer);
                maze2D.update();
                saveMaze();
            });

            //on mouseover
            maze2D.blocks[y][x].rect.on('mouseover', function(){
                document.body.style.cursor = 'pointer';
            });

            //on mouseout
            maze2D.blocks[y][x].rect.on('mouseout', function(){
                document.body.style.cursor = 'default';
            });
            
        }
    }

    //bind events for locations
    for(var key in maze2D.locations){
        var locationRect = maze2D.locations[key].rect;

        locationRect.on('dragend', function(){ 
            maze2D.recalculateLocation(this.index);
            saveMaze();
        });
        locationRect.on('mouseover', function(){ document.body.style.cursor = 'move'; });
        locationRect.on('mouseout', function(){ document.body.style.cursor = 'default'; });
    }
}

function saveMaze(){
    var errorHand = new ErrorHandler(); 
    errorHand.clearErrorBox();
    if(errorHand.checkErrors(maze2D.data, maze2D.locations)){
       errorHand.outputErrors();
       console.log("maze not saved");
       return false;
    }else{
        errorHand.reset();
        maze2D.save();
        console.log("maze saved");
        return true;
    }
}
