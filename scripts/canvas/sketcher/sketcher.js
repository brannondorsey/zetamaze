var sketcher = null;
var brush = null;
var wallDrawing;
var canvas;
var mousePressed = false;
var prevMousePos;
var dragToolEnabled = false;

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
     var fb = $.farbtastic('#colorpicker',setColor);
     $('#colorpicker').hide();
     $('#color_swatch').click(function(){ 
        sketcher.context.globalCompositeOperation = 'source-over';
        hideMenus();
        $('#colorpicker').toggle();
     });

     //drag bindings
    $(".drag_button").click(function(){
        sketcher.setEnabled(dragToolEnabled); //this is done before the toggle
        dragToolEnabled = !dragToolEnabled;
        hideMenus();
        $('#sketch').toggleClass('grab');
        $(this).toggleClass('tool-selected');
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

    canvas.addEventListener('mouseup', function(evt){
        
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

    wallDrawing = new WallDrawing(hostname, canvas, 650);

    bindEvents();

    //constantly check if init images have been loaded
    var interValID = setInterval(function(){
      if(wallDrawing.initImagesLoaded()){
        wallDrawing.display();
        clearInterval(interValID);
      }
    }, 100);
    
});
