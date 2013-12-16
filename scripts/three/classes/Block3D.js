function Block3D(x, y, z, w, h, d, textureNames, onTextureLoadFunc){
    this.onTextureLoadFunc = onTextureLoadFunc;
    this._numbTextures = 0;
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	var geometry = new THREE.CubeGeometry(w, h, d);
	var material = this._getMaterial(textureNames);
	this.cube = new THREE.Mesh(geometry, material);
	this.cube.position = new THREE.Vector3(x, y, z);
}

Block3D.prototype.getNumbTextures = function(){
    return this._numbTextures;
}

Block3D.prototype.getMesh = function(){
    return this.cube;
}

Block3D.prototype._getMaterial = function(textureNames){
	// create an array with six textures for a cool cube
    var materialArray = [];
    var self = this;
    for(var i = 0; i < textureNames.length; i++){
    	var material;
    	if(textureNames[i] != 0){
    		material = new THREE.MeshLambertMaterial( { 
    			map: THREE.ImageUtils.loadTexture(textureNames[i],
			    new THREE.UVMapping(), 
			    function() {
			  	  self.onTextureLoadFunc();
			    }) 
    		});
            this._numbTextures++;
    	}else{
    		material = new THREE.MeshLambertMaterial({
    			color: 0x000000
    		})
    	}
    	materialArray.push(material);
    }
    
    return new THREE.MeshFaceMaterial(materialArray);       
}

