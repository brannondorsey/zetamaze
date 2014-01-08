/*
Copyright (c) tomazy <https://github.com/tomazy>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
create a semi-transparent image to be used as a brush tip
*/
function MarkerMaker(stamp_img,color) {
   this.length = stamp_img.width;
   this.canvas = $('<canvas width="'+this.length+'px" height="'+this.length+'px">');
   this.context = this.canvas[0].getContext('2d');
   this.context.fillStyle = color;
   this.context.fillRect(0, 0, this.length, this.length);
   this.context.globalCompositeOperation = 'destination-in';
   this.context.drawImage(stamp_img,0,0);
   return this.canvas[0];
   
}

MarkerMaker.prototype.make = function () {
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

MarkerMaker.prototype.getImage = function() {
}


