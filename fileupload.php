<?php

	require_once 'includes/filevalidation.include.php';

	$redirect_page = "make.php";
	$targetID = "#file-upload-notification";
	$upload_directory = "uploads";


	$return_data = [];
	if(isset($_FILES) &&
	   !empty($_FILES)){

	   	$numb_files = count($_FILES);
		for($i = 0; $i < $numb_files; $i++){

			$filename = "file" . ($i + 1);
			$file = $_FILES[$filename];
			$temp = explode(".", $file["name"]);
			$extension = end($temp);

			if(isset($file) &&
			   !empty($file) &&
			   $file["error"] != 4){ //no file uploaded

				if(in_array($extension, $allowed_exts)){

					if($file["size"] < $max_size){
						if($file["error"] > 0){
							$return_data[$filename] = urlencode($file["error"]);
						}else{ //the file is good!


							  //delete the old file
							  $current_files = scandir($upload_directory);

							  for($j = 0; $j < count($current_files); $j++){
							  	if(strstr($current_files[$j], $filename) != false){
							  		unlink($upload_directory . "/" . $current_files[$j]);
							  	}
							  }

						      move_uploaded_file($file["tmp_name"], $upload_directory . "/" . $filename . "." . $extension);
						}
					}else $return_data[$filename] = "size_error";
				}else $return_data[$filename] = "type_error";
			}
		}
	}

	$redirect_page .= "?";
	if(count($return_data) > 0){
		foreach($return_data as $key => $value){
			$redirect_page .= $key . "=" . $value . "&";
		}
		$redirect_page = rtrim($redirect_page, "&");
	}else{
		$redirect_page .= "file-upload-success=true";
	}
	
	header("Location: " . $redirect_page . $targetID);
?>