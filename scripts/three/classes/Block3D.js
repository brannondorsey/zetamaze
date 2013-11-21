function Block3D(x, y, z, w, h, d){
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	var geometry = new THREE.CubeGeometry(w, h, d);
	var material = new THREE.MeshBasicMaterial({color: color});
	this.cube = new THREE.Mesh(geometry, material);
	this.cube.position = new THREE.Vector3(x, y, z);
}