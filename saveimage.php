<?php
	require_once 'includes/config.include.php';
	require_once 'includes/classes/class.SimpleImage.php';
	$images_folder = "images/maze/textures";
	$small_images_folder = "images/maze/textures_small";
	$file_name_key = "filename";
	$image_data_key = "base64";
	$small_image_size = 256;

	if(isset($_SERVER["HTTP_REFERER"])){
		$referer = $_SERVER["HTTP_REFERER"];
		$referer = preg_replace( "/([?#&][^?&=#]+)=([^&#]*)/", "", $referer); 
		if($referer == $HOSTNAME . "/draw.php" &&
		   isset($_POST[$file_name_key]) &&
		   !empty($_POST[$file_name_key]) &&
		   isset($_POST[$image_data_key]) &&
		   !empty($_POST[$image_data_key])){

		   	#do sanitation here...
		   	
		   	$filename = $_POST[$file_name_key];

			$base64String = urldecode($_POST[$image_data_key]);
			$base64String = str_replace('data:image/png;base64,', '', $base64String);
			$image = base64_decode($base64String);
			$bytes_written = file_put_contents($images_folder . "/" . $filename, $image);
			// echo "bytes written: ";
			// var_dump($bytes_written);
			// echo "is writable: ";
			// var_dump(is_writable($images_folder . "/" . $filename));
			// echo $images_folder . "/" . $filename;
			// echo " ";


			// $perms = fileperms($images_folder);

			// if (($perms & 0xC000) == 0xC000) {
			//     // Socket
			//     $info = 's';
			// } elseif (($perms & 0xA000) == 0xA000) {
			//     // Symbolic Link
			//     $info = 'l';
			// } elseif (($perms & 0x8000) == 0x8000) {
			//     // Regular
			//     $info = '-';
			// } elseif (($perms & 0x6000) == 0x6000) {
			//     // Block special
			//     $info = 'b';
			// } elseif (($perms & 0x4000) == 0x4000) {
			//     // Directory
			//     $info = 'd';
			// } elseif (($perms & 0x2000) == 0x2000) {
			//     // Character special
			//     $info = 'c';
			// } elseif (($perms & 0x1000) == 0x1000) {
			//     // FIFO pipe
			//     $info = 'p';
			// } else {
			//     // Unknown
			//     $info = 'u';
			// }

			// // Owner
			// $info .= (($perms & 0x0100) ? 'r' : '-');
			// $info .= (($perms & 0x0080) ? 'w' : '-');
			// $info .= (($perms & 0x0040) ?
			//             (($perms & 0x0800) ? 's' : 'x' ) :
			//             (($perms & 0x0800) ? 'S' : '-'));

			// // Group
			// $info .= (($perms & 0x0020) ? 'r' : '-');
			// $info .= (($perms & 0x0010) ? 'w' : '-');
			// $info .= (($perms & 0x0008) ?
			//             (($perms & 0x0400) ? 's' : 'x' ) :
			//             (($perms & 0x0400) ? 'S' : '-'));

			// // World
			// $info .= (($perms & 0x0004) ? 'r' : '-');
			// $info .= (($perms & 0x0002) ? 'w' : '-');
			// $info .= (($perms & 0x0001) ?
			//             (($perms & 0x0200) ? 't' : 'x' ) :
			//             (($perms & 0x0200) ? 'T' : '-'));

			// echo "File permissions: " . $info;


			if($bytes_written !== false){
				$image = new SimpleImage();
				$image->load(base64_decode($base64String), true);
				$image->resize($small_image_size, $small_image_size);
				$image->save($small_images_folder . "/" . $filename, IMAGETYPE_PNG, 9);
				die("saved image to the server"); 
			}              
		}
	}
	echo "failed to save image to the server";
?>