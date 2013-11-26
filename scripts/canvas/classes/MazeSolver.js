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

    this.up = 1;
    this.right = 2;
    this.down = 3;
    this.left = 4;
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
    else return false;
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

MazeSolver.prototype.getTextureData = function(){
    var mazeTravelData = this._getMazeTravelData();
    return this._getWallFaceData(mazeTravelData);
}

//because 2D arrays are passed by reference this function copies the maze
MazeSolver.prototype.getCopy = function(maze){
    var arrayToReturn = [];
    for(var i = 0; i < maze.length; i++){
        arrayToReturn[i] = maze[i].slice();
    }
    return arrayToReturn;
}


MazeSolver.prototype._getWallFaceData = function(mazeTravelData){
    //get a copy of the maze so that we can overwrite the 1s and 0s
    //with arrays containting the image names of their textures
    var wallFaceData = this.getCopy(this.maze);
    
    //loop through each wall/rect in the maze
    for(var y = 0; y < this.mazeHeight; y++){
        for(var x = 0; x < this.mazeWidth; x++){
            

            var fillerImage = 0;
            wallFaceData[y][x] = [fillerImage,
                                  fillerImage,
                                  fillerImage,
                                  fillerImage,
                                  fillerImage,
                                  fillerImage];

            for(var i = 0; i < mazeTravelData.length; i++){
               
                var travelDataObj = mazeTravelData[i];
                // console.log("dir is " + travelDataObj.dir);
                // console.log("i is " + i);
                // console.log(travelDataObj);
                //if this x and y equal the x and y to the right of this travelDataObj
                if(travelDataObj.rightX == x &&
                   travelDataObj.rightY == y){

                    //calculate face index using dir
                    var faceIndex = this._getFaceIndex(travelDataObj.dir);
                    //console.log(faceIndex);

                    //overwrite filler image with imageIndex
                    var nextImage = travelDataObj.imageIndex;
                    wallFaceData[y][x][faceIndex] = nextImage;

                    //remove this travelDataObj from mazeTravelData array
                    mazeTravelData.splice(i, 1);
                }
            }
        }
    }
   
   //console.log(wallFaceData);
   return wallFaceData;
}

//returns an array of mazeTravelData objs representing each location and dir
//where a wall segment is to the right of dir
MazeSolver.prototype._getMazeTravelData = function(){

    var mazeTravelData = [];
    var done = false;
    var imageIndex = 1;

    var startX = this.startingPoint.x;
    var startY = this.startingPoint.y;
    var currentX;
    var currentY;
    var startDir;
    var currentDir;

    //sets the initial direction only
   if(this.maze[startY - 1][startX] == this.free) {  
         startDir = this.up; 
   }else if(this.maze[startY][startX + 1] == this.free) {
         startDir = this.right; 
   }else if(this.maze[startY + 1][startX] == this.free) {
         startDir = this.down; 
   }else if(this.maze[startY][startX - 1] == this.free) {
         startDir = this.left;
   }

   currentDir = startDir;
   currentX = startX;
   currentY = startY;
   var test = 0;

    while(!done){
        
        /*
        Three possibilities:
        1. There is a wall to your right and no wall in front of you.
        2. There is a wall to your right and a wall in front of you.
        3. There is no wall to your right.
        */
       
        var rightX;
        var rightY;
        var forwardX;
        var forwardY;
        var targetX;
        var targetY;
        var targetDir;
        var wallToRight = true;

        var forward = this._getForward(currentX, currentY, currentDir);
        var forwardX = forward.x;
        var forwardY = forward.y;

        var right = this._getForward(currentX, currentY, currentDir + 1);
        var rightX = right.x;
        var rightY = right.y;
    
        //1. there is a wall to your right and no wall in front of you
        if(this.maze[rightY][rightX] == this.wall &&
           this.maze[forwardY][forwardX] == this.free){
            //maintain the direction and walk forward
            // console.log("1. There is a wall to my right and no wall in front of me.");
            // console.log("I am maintaining my direction and walking forward.");
            targetDir = currentDir;
            targetX = forwardX;
            targetY = forwardY;
        }//2. there is a wall to your right and a wall in front of you
        else if(this.maze[rightY][rightX] == this.wall &&
                this.maze[forwardY][forwardX] == this.wall){
            //maintain the position and change the direction
            // console.log("2. There is a wall to my right and a wall in front of me.");
            // console.log("I am rotating left only.");
            targetDir = currentDir - 1; //turn left
            if(targetDir < 1) targetDir = 4;

            targetX = currentX;
            targetY = currentY;
        }//3. there is no wall to your right
        else{
            //turn right and walk 1 position forward
            // console.log("3. There is no wall to my right.");
            // console.log("I am rotating right and then walking forward.");
            targetDir = currentDir + 1;
            if(targetDir > 4) targetDir = 1;
            //walk forward

            targetX = rightX;
            targetY = rightY;
            wallToRight = false;
        }
        console.log("");

        //if we all faces have been indexed
        if(imageIndex > 1 && 
           currentX == startX &&
           currentY == startY &&
           currentDir == startDir){
            // console.log("I finished!!!");
            // console.log("This maze uses " + imageIndex + " images");
            done = true;
        }else if(wallToRight){
            var blockToRight = this._getForward(currentX, currentY, currentDir + 1);
            mazeTravelData.push({
                imageIndex: imageIndex,
                currentX: currentX,
                currentY: currentY,
                rightX: blockToRight.x,
                rightY: blockToRight.y,
                dir: currentDir
            });
            imageIndex++;
        }

        currentX = targetX;
        currentY = targetY;
        currentDir = targetDir;
        
        //prevent a browser crashing infinite loop if I mess something up
        test++;
        if(test > 10000) done = true;
            
    }

    // //print the findings
    // for(var obj in mazeTravelData){
    //     var dirString = "";

    //     switch(mazeTravelData[obj].dir){
    //         case 1:
    //             dirString = "up";
    //             break;
    //         case 2:
    //             dirString = "right";
    //             break;
    //         case 3:
    //             dirString = "down";
    //             break;
    //         case 4:
    //             dirString = "left";
    //             break;
    //     }

    //     console.log("direction: " + dirString);
    //     console.log(mazeTravelData[obj].x + ", " + mazeTravelData[obj].y);
    //     console.log("");
    // }
    return mazeTravelData;
}

//returns a Point obj
MazeSolver.prototype._getForward = function(currentX, currentY, currentDir){
        //figure out the x and y positions of the location in front
        //of you and the location to your right
        if(currentDir > 4) currentDir = 1;
        else if (currentDir < 1) currentDir = 4;

        var forwardX;
        var forwardY;
        if(currentDir == this.up){
            forwardX   = currentX;
            forwardY   = currentY - 1;
        }else if(currentDir == this.right){
            forwardX   = currentX + 1;
            forwardY   = currentY;
        }else if(currentDir == this.down){
            forwardX   = currentX;
            forwardY   = currentY + 1;
        }else if(currentDir == this.left){
            forwardX   = currentX - 1;
            forwardY   = currentY;
        }
        return new Point(forwardX, forwardY);
}

//returns an index 0-5 that corresponds with the material face index in threejs
MazeSolver.prototype._getFaceIndex = function(dir){
    console.log(dir);
    var faceIndexes = [1, 5, 0, 4]; //[up, right, down, left] [1, 5, 0, 4]
    return faceIndexes[dir - 1];
}