function SketchPad( canvasID, brushImagePath, brushLoadCallback ) {
	this.points = [];
    this.renderFunction = this.updateCanvasByBrush;
	this.brush = new Image();
	this.brush.src = brushImagePath;
	this.brush.onload = brushLoadCallback;
	this.touchSupported = ('ontouchstart' in window); 
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.context.strokeStyle = "#000000";
  //  this.context.globalCompositeOperation = 'destination-out';
	this.context.lineWidth = 10;
	this.lastMousePoint = {x:0, y:0};
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	this.enabled = true;
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
}

SketchPad.prototype.setEnabled = function(bool){
	this.enabled = bool;
}

SketchPad.prototype.isEnabled = function(){
	return this.enabled;
}

SketchPad.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		if(self.enabled){
	        self.preOnCanvasMouseDown.call();
	        
			self.mouseMoveHandler = self.onCanvasMouseMove()
			self.mouseUpHandler = self.onCanvasMouseUp()

			$(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
			$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
			
			self.updateMousePosition( event );
	        self.points.push([self.lastMousePoint.x, self.lastMousePoint.y]);
			self.renderFunction( event );
		}
	}
}

SketchPad.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {
		if(self.enabled){
			self.renderFunction( event );
	     	event.preventDefault();
     	}
    	return false;
	}
}
SketchPad.prototype.onCanvasMouseUp = function (event) {
	var self = this;
	return function(event) {
        self.points = [];
		$(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	}
}

SketchPad.prototype.updateMousePosition = function (event) {
 	var target;
	if (this.touchSupported) {
		target = event.originalEvent.touches[0]
	}
	else {
		target = event;
	}

	var offset = this.canvas.offset();
	this.lastMousePoint.x = target.pageX - offset.left;
	this.lastMousePoint.y = target.pageY - offset.top;
}

SketchPad.prototype.updateCanvasByLine = function (event) {

	this.context.beginPath();
	this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.updateMousePosition( event );
	this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.context.stroke();
}

SketchPad.prototype.updateCanvasByBrush = function (event) {
	var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.updateMousePosition( event );
    this.points.push([this.lastMousePoint.x, this.lastMousePoint.y]);
	var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.drawLine( start, end );
}

SketchPad.prototype.drawLine = function (start, end){

	var halfBrushW = this.brush.width/2;
	var halfBrushH = this.brush.height/2;
    var dx = end.x - start.x;
    var dy = end.y - start.y;
	var distance = parseInt( Math.sqrt(dx*dx + dy*dy) );
	if ( distance > 20 ){
         
        var s = Smooth(this.points,{ 
 			method: 'cubic',
    		clip: 'clamp',
    		cubicTension: 0
        });
        
        for (var t=this.points.length - 2; t <= this.points.length - 1; t+= (1/distance)) {
          var x,y;
          var point = s(t);
          var x = point[0] - halfBrushW;
          var y = point[1] - halfBrushH;
        	this.context.drawImage(this.brush, x, y);

        }
    }else if (distance > 0 && distance <= 20) {
      // console.log('slow:' + distance);
		var x,y;
		var sin_a = ( end.y - start.y ) / distance;
		var cos_a = ( end.x - start.x ) / distance;
        
		for ( var z=0; z <= distance - 1; z++ ){
			x = start.x + ( cos_a * z ) - halfBrushW;
			y = start.y + ( sin_a * z ) - halfBrushH;
			this.context.drawImage(this.brush, x, y);
		}

	} else {
      	this.context.drawImage(this.brush, start.x - halfBrushW, start.y - halfBrushH);
    }
}

SketchPad.prototype.toString = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

SketchPad.prototype.toDataURL = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	return dataString;
}

SketchPad.prototype.clear = function () {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
}

SketchPad.prototype.preOnCanvasMouseDown = function() {
   //override this...
   // console.log('hi');
}
			
