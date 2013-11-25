function Block3D(x, y, z, w, h, d, textureNames){
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	var geometry = new THREE.CubeGeometry(w, h, d);
	var material = this._getMaterial(textureNames);
	this.cube = new THREE.Mesh(geometry, material);
	this.cube.position = new THREE.Vector3(x, y, z);
}

Block3D.prototype._getMaterial = function(textureNames){
	// create an array with six textures for a cool cube
    var materialArray = [];
    for(var i = 0; i < textureNames.length; i++){
    	var material;
    	if(materialArray[i] != 0){
    		material = new THREE.MeshLambertMaterial( { 
    			map: THREE.ImageUtils.loadTexture(textureNames[i],
    										  new THREE.UVMapping(), 
    										  function() {
    										  	console.log("I loaded an image");
    										  }) 
    		});
    	}else{
    		material = new THREE.MeshLambertMaterial({
    			color: red
    		})
    	}
    	materialArray.push(material);
    }
    
    return new THREE.MeshFaceMaterial(materialArray);       
}

