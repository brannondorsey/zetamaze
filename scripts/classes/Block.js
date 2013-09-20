function Block(index, state, x, y, w, z){
	this.primaryColor   = 'black';
	this.secondaryColor = 'white';

	this.index = index;
	this.state = state;
	this.rect  = new Kinetic.Rect({
		x: x,
		y: y,
		width: w,
		height: z,
		fill: this.primaryColor,
	});
	this.assignColor();
}

Block.prototype.toggleState = function(){
	this.state = !this.state;
	this.assignColor();
}

Block.prototype.assignColor = function(){
	if(this.state) this.rect.setFill(this.primaryColor);
	else this.rect.setFill(this.secondaryColor);
}