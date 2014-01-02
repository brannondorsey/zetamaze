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
			if($bytes_written !== false){

				$image = new SimpleImage();
				$image->load($images_folder . "/" . $filename);
				$image->resize($small_image_size, $small_image_size);
				$image->save($small_images_folder . "/" . $filename, IMAGETYPE_PNG, 9);
				die("success"); 
			}                    
		}
	}
	echo "failure";
?>