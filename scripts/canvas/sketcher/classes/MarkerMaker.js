/*
create a semi-transparent image to be used as a brush tip
*/
function markerMaker(stamp_img,color) {
   this.length = stamp_img.width;
   this.canvas = $('<canvas width="'+this.length+'px" height="'+this.length+'px">');
   this.context = this.canvas[0].getContext('2d');
   this.context.fillStyle = color;
   this.context.fillRect(0, 0, this.length, this.length);
   this.context.globalCompositeOperation = 'destination-in';
   this.context.drawImage(stamp_img,0,0);
   return this.canvas[0];
   /*
   tmp.onload = function() {
      self.length = tmp.width;
      self.canvas = $('<canvas width="'+this.length+'px" height="'+this.length+'px">');
      self.context = self.canvas[0].getContext('2d');
      self.context.fillStyle = color;
      self.context.fillRect(0, 0, self.length, self.length);
   }
   tmp.src = stamp_url;
   
   this.stamp = tmp; */

/* create canvas of exact size 
   this.canvas = $('<canvas width="'+this.length+'px" height="'+this.length+'px">');
   this.context = this.canvas[0].getContext('2d');
   this.context.fillStyle = color;
   this.context.fillRect(0, 0, this.length, this.length);*/
 //  this.context.globalCompositeOperation = 'destination-in';
//this.context.drawImage(this.stamp,0,0);

  // return this.canvas[0];
    /*
    this.length = length || 30;
    this.color = color || 'black';
    this.canvas = $('<canvas width="'+length+'px" height="'+length+'px" style="border:1px solid gray;">');
    this.context = this.canvas[0].getContext('2d');
    this.make();*/
}

markerMaker.prototype.make = function () {
   this.context.fillStyle = "rgba(255,0,0,0.5)";
    this.context.beginPath();

  this.context.moveTo(0,0);
  this.context.quadraticCurveTo(this.length * 0.6, this.length * 0.0, this.length, this.length);
  this.context.moveTo(0,0);
  this.context.quadraticCurveTo(this.length * 0.0, this.length * 0.6, this.length, this.length);
  this.context.closePath();
  var grd = this.context.createLinearGradient(0, 0, this.length, this.length);
        // light blue
        grd.addColorStop(1, "rgba(0,0,0,0.3)");
        // dark blue
        grd.addColorStop(0, "rgba(0,0,0,0.05)");
        this.context.fillStyle = grd;
  
  this.context.fill();



        


}

markerMaker.prototype.getImage = function() {
}


