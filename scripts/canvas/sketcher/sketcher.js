var sketcher = null;
var brush = null;
var wallDrawing;
var canvas;
var mousePressed = false;
var prevMousePos;
var dragToolEnabled = false;
var fb; //color picker

function hideMenus() {
  $('#colorpicker').hide();
}

function installBrush(img, color) {
  brush = new MarkerMaker(img, color);
  sketcher.brush = brush;
  sketcher.renderFunction = sketcher.updateCanvasByBrush;
}

function setColor(color) {
  installBrush(sketcher.brush, color);
  $('#color_swatch').css('background-color',color);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function bindEvents(){

     //color picker bindings
     $('#colorpicker').hide();
     $('#color_swatch').click(function(){ 
        sketcher.context.globalCompositeOperation = 'source-over';
        //hideMenus();
        $('#colorpicker').toggle();
     });

     //drag bindings
    $("#tool_button").click(function(){
        sketcher.setEnabled(dragToolEnabled); //this is done before the toggle
        dragToolEnabled = !dragToolEnabled;
        hideMenus();
        $('#sketch').toggleClass('grab');
        $('#sketch').toggleClass('drawing');
        $('#tool_button').toggleClass('drag_button');
        $('#tool_button').toggleClass('draw_button');
    });

    canvas.addEventListener('mousemove', function(evt) {
        if(mousePressed){

          var currentMousePos = getMousePos(canvas, evt);

          if(dragToolEnabled){ //dragging...
            wallDrawing.drag(prevMousePos.x, currentMousePos.x);
            wallDrawing.loadImages(prevMousePos.x, currentMousePos.x);
          }else{ //drawing...
            wallDrawing.notifyNeedsUpdate(prevMousePos.x, currentMousePos.x);
          }
          prevMousePos = currentMousePos;
        }          
    }, false);

    canvas.addEventListener('mousedown', function(evt){
        mousePressed = true;
        prevMousePos = getMousePos(canvas, evt);

        if(dragToolEnabled){
          $('canvas').toggleClass('grabbing', true);
        }
    }, false);

    //the mouse up event must be tied to the document, not the canvas
    document.addEventListener('mouseup', function(evt){    
        if(dragToolEnabled){
          $('canvas').toggleClass('grabbing', false);
        }else{ //save images
          wallDrawing.updateImages();
        }
        mousePressed = false;
    }, false);
}

$(document).ready(function(e) {
	
    canvas = $("#sketch")[0];
	  sketcher = new SketchPad("sketch", $("#default-brush-image")[0]);
    sketcher.preOnCanvasMouseDown = function(){
       hideMenus();
    }

    wallDrawing = new WallDrawing(hostname, canvas, 720);

    //start color picker at random color
    fb = $.farbtastic('#colorpicker', setColor);
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    fb.setColor(randomColor);

    bindEvents();

    //constantly check if init images have been loaded
    var interValID = setInterval(function(){
      if(wallDrawing.initImagesLoaded()){
        wallDrawing.display();
        clearInterval(interValID);
      }
    }, 100);
    
});
