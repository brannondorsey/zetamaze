var sketcher = null;
var brush = null;
var wallDrawing;
var canvas;
var mousePressed = false;
var prevMousePos;
var dragToolEnabled = false;
var fb; //color picker
var reloadRate = 120; //in seconds
var reloadTimeout;
var loading;

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

function setReloadTimeout(){

    if(typeof reloadTimeout !== 'undefined') clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(function(){

      var url = location.href;
      var qIndex = url.indexOf('?');
      if(qIndex != -1) url = url.substring(0, qIndex);
      url = url + '?drawing=' + wallDrawing.getMiddleWall().imageIndex + '&color=' + fb.color.substring(1);
      url = url + '&offset=' + wallDrawing.getMiddleWallOffset() + '&t=' + new Date().getTime();
      window.location.href = 'redirect.php?url=' + encodeURIComponent(url);
    },reloadRate * 1000);
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

    document.addEventListener('mousemove', function(evt){
      setReloadTimeout();
    });

    canvas.addEventListener('mousemove', function(evt) {
        
        if(mousePressed){

          var currentMousePos = getMousePos(canvas, evt);

          if(dragToolEnabled){ //dragging...
            if(wallDrawing.drag(prevMousePos.x, currentMousePos.x) == false){
              loading = true;
              $('.loading').show();
              setTimeout(function(){$('.loading').hide()}, 1500);
            }else{
              loading = false;
              if(sketcher.isEnabled()) $('.loading').hide();
            }
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
          sketcher.setEnabled(false);
          $('canvas').toggleClass('grabbing', true);
        }else sketcher.setEnabled(true);
        
    }, false);

    //the mouse up event must be tied to the document, not the canvas
    document.addEventListener('mouseup', function(evt){    

        if(dragToolEnabled){
          $('canvas').toggleClass('grabbing', false);
        }else if(!loading &&
                 sketcher.isEnabled()){ //save images
          wallDrawing.updateImages();
        }
        mousePressed = false;
    }, false);
}

$(document).ready(function(e) {
	
    canvas = $("#sketch")[0];
	  sketcher = new SketchPad("sketch", "images/sketcher/tip.png", function(){
      sketcher.setEnabled(false);
      wallDrawing = new WallDrawing(hostname, canvas, imageSize, numbImages, initImageIndex, initImageOffset);
      //start color picker at random color
      fb = $.farbtastic('#colorpicker', setColor);
      fb.setColor(initColor);
      setReloadTimeout();
      bindEvents();

    });

    //constantly check if first images are loaded
    //this is a kind of gross way to do it but oh
    //well at least I said it
    var intervalID = setInterval(function(){
      if(wallDrawing.initImagesLoaded()){
        sketcher.setEnabled(true);
        $('.loading').hide();
        clearInterval(intervalID);
      }
    }, 100);

    sketcher.preOnCanvasMouseDown = function(){
       hideMenus();
    }    
});
