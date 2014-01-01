<?php
	require_once 'includes/config.include.php';
	$images_folder = "images/maze/textures/";
	$file_name_key = "filename";
	$image_data_key = "base64";

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
			$success = file_put_contents($images_folder . $filename, $image);
			echo "success";                       
		}else echo "failure";
	}else echo "failure";
?>