function Block(index, state, x, y, w, z){
	this.index = index;
	this.state = state;
	if(this.state){
		this.rect  = new Kinetic.Rect({
			x: x,
			y: y,
			width: w,
			height: z,
			fill: 'black',
		});
	}
}