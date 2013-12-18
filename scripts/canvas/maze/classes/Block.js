function Block(index, state, x, y, w, h){
	this._primaryColor   = 'black';
	this._secondaryColor = 'white';

	this._index = index;
	this.state = state;
	this.rect  = new Kinetic.Rect({
		x: x,
		y: y,
		width: w,
		height: h,
		fill: this.primaryColor,
	});
	this.assignColor();
}

Block.prototype.toggleState = function(){
	this.state = !this.state;
	this.assignColor();
}

Block.prototype.assignColor = function(){
	if(this.state) this.rect.setFill(this._primaryColor);
	else this.rect.setFill(this._secondaryColor);
}