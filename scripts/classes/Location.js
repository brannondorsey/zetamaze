function Location(config){
    this.mazeX = config.mazeX;
    this.mazeY = config.mazeY;
    this.primaryColor = config.primaryColor;
    this.rect  = new Kinetic.Rect({
		x: config.x,
		y: config.y,
		width: config.w,
		height: config.h,
		fill: this.primaryColor,
		draggable: true
	});
}

